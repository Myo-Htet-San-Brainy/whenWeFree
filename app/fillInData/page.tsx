"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Calendar,
  SlotInfo,
  momentLocalizer,
  Views,
  View,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop, {
  EventInteractionArgs,
} from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { useMutation } from "@tanstack/react-query";
import { MyEvent } from "../interfaces";
import { addEvent, deleteEvent, patchEvent } from "../Mock";
import {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from "../components/Drawer";
import { Button } from "../components/Button";
import toast from "react-hot-toast";
import {
  useCreateEventMutation,
  useDeleteEvent,
  useGetEvents,
  usePatchEvent,
} from "../query/event";
import { useSession } from "next-auth/react";
import { CustomError } from "@/lib/customError";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const Page = () => {
  const [events, setEvents] = useState<MyEvent[]>([]);
  const [selectedEv, setSelectedEv] = useState<null | MyEvent>(null);
  const drawerTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [view, setView] = useState<View>(Views.WEEK);
  const [date, setDate] = useState(new Date());
  const { data: session } = useSession();
  const userId = session?.user.id;

  const { isError, error, data: fetchedEvs } = useGetEvents({ userId });
  if (isError) {
    if (error instanceof CustomError && error.status === 404) {
      console.log("no teams");
      toast.error("You haven't filled in any free time.");
    }
  }
  useEffect(() => {
    if (fetchedEvs) {
      setEvents(fetchedEvs);
    }
  }, [fetchedEvs]);

  const handleOnChangeView = useCallback(
    (selectedView: View) => {
      setView(selectedView);
    },
    [setView]
  );

  const onNavigate = useCallback(
    (newDate: Date) => {
      return setDate(newDate);
    },
    [setDate]
  );

  const { mutate } = useCreateEventMutation();

  const { mutate: patchEvMutate } = usePatchEvent();

  const { mutate: deleteEvMutate } = useDeleteEvent();

  function handleSelectSlot(data: SlotInfo) {
    if (!userId) {
      toast.error("Try again after a moment.");
      return;
    }
    const newEvent: MyEvent = {
      id: uuidv4(), //temp id
      title: "free",
      start: data.start,
      end: data.end,
    };
    setEvents((prev) => [...prev, newEvent]);

    mutate(
      { event: newEvent, userId },
      {
        onError(error, variables, context) {
          setEvents((prevEvents) =>
            prevEvents.filter((event) => event.id !== variables.event.id)
          );
          toast.error(
            error.message || "Something went wrong while adding the event."
          );
        },
        onSuccess(data, variables, context) {
          setEvents((prevEvents) =>
            prevEvents.map((event) => {
              if (event.id === variables.event.id) {
                return { ...event, id: data };
              }
              return event;
            })
          );
          toast.success("Event added successfully!");
        },
      }
    );
  }
  // console.log("events", events);

  function handleEventUpdate(data: EventInteractionArgs<MyEvent>) {
    const eventId = data.event.id!;
    const payload = { start: data.start as Date, end: data.end as Date };
    let orgStart: Date, orgEnd: Date;
    const newEvents = events.map((event) => {
      if (event.id === eventId) {
        orgStart = event.start!;
        orgEnd = event.end!;
        return { ...event, ...payload };
      }
      return event;
    });
    setEvents(newEvents);
    patchEvMutate(
      {
        eventId,
        payload,
      },
      {
        onError(error, variables, context) {
          if (error instanceof CustomError && error.status === 404) {
            // Remove the event with id === eventId
            setEvents((prev) => prev.filter((event) => event.id !== eventId));
          } else {
            // Revert changes to original start/end times
            setEvents((prev) =>
              prev.map((event) =>
                event.id === eventId
                  ? { ...event, start: orgStart, end: orgEnd }
                  : event
              )
            );
          }

          toast.error(error.message || "Failed to update the event.");
        },

        onSuccess(data, variables, context) {
          toast.success("Event updated successfully!");
        },
      }
    );
  }

  function handleSelectEvent(
    event: MyEvent,
    e: React.SyntheticEvent<HTMLElement>
  ) {
    //show panel
    if (!drawerTriggerRef.current) {
      alert("Please try again later");
    }
    setSelectedEv(event);
    drawerTriggerRef.current?.click();
  }

  function handleDelete() {
    drawerTriggerRef.current?.click();
    setSelectedEv(null);

    const eventId = selectedEv?.id!;
    const deletedEvent = events.find((event) => event.id === eventId);
    const newEvents = events.filter((event) => event.id !== eventId);
    setEvents(newEvents);

    deleteEvMutate(
      { eventId },
      {
        onError(error, variables, context) {
          if (error instanceof CustomError && error.status === 404) return;

          setEvents((prev) => [...prev, deletedEvent!]);
          toast.error(error.message || "Failed to delete the event.");
        },
        onSuccess() {
          toast.success("Event deleted successfully!");
        },
      }
    );
  }

  return (
    <div>
      <DnDCalendar
        events={events.length <= 0 ? undefined : events}
        selectable
        localizer={localizer}
        style={{ height: "100vh" }}
        // defaultView="week"
        onEventResize={handleEventUpdate}
        onEventDrop={handleEventUpdate}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        // toolbar={false}
        view={view}
        onView={handleOnChangeView}
        date={date}
        onNavigate={onNavigate}

        // selected={selectedEv}
      />
      <Drawer direction="left">
        <DrawerTrigger ref={drawerTriggerRef} className="hidden" />
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{selectedEv?.title || "Event Details"}</DrawerTitle>
            <DrawerDescription>
              {selectedEv && (
                <div>
                  <p>
                    <strong>Start:</strong>{" "}
                    {moment(selectedEv.start).format("LLL")}
                  </p>
                  <p>
                    <strong>End:</strong> {moment(selectedEv.end).format("LLL")}
                  </p>
                  {/* Add more event details as needed */}
                </div>
              )}
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button onClick={handleDelete}>Delete</Button>
            <DrawerClose>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Page;
