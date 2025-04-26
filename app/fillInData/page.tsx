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

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const Page = () => {
  const [events, setEvents] = useState<MyEvent[]>([]);
  const [selectedEv, setSelectedEv] = useState<null | MyEvent>(null);
  const drawerTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [view, setView] = useState<View>(Views.WEEK);
  const [date, setDate] = useState(new Date());

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

  const AddEvMutation = useMutation({
    mutationFn: addEvent,
    onMutate: (newEvent) => {
      setEvents((prev) => [...prev, newEvent]);
      console.log("onMutate");
    },
    onError(error, newEvent, context) {
      const newEvents = events.filter((event) => event.id !== newEvent.id);
      setEvents(newEvents);
      toast.error(
        error.message || "Something went wrong while adding the event."
      );
    },
    onSuccess(data, newEvent, context) {
      const newEvents = events.map((event) => {
        if (event.id === newEvent.id) {
          event.id = data;
          return event;
        }
        return event;
      });
      setEvents(newEvents);
      toast.success("Event added successfully!");
    },
  });

  const patchEvMutation = useMutation({
    mutationFn: patchEvent,
    onMutate(variables) {
      const { id, payload } = variables;
      let orgStart, orgEnd;
      const newEvents = events.map((event) => {
        if (event.id === id) {
          orgStart = event.start;
          orgEnd = event.end;
          return { ...event, ...payload };
        }
        return event;
      });
      setEvents(newEvents);
      return { orgStart, orgEnd };
    },
    onError(error, variables, context) {
      const { orgStart: start, orgEnd: end } = context!;
      const newEvents = events.map((event) => {
        if (event.id === variables.id) {
          return { ...event, start, end };
        }
        return event;
      });
      setEvents(newEvents);
      toast.error(error.message || "Failed to update the event.");
    },
    onSuccess(data, variables, context) {
      toast.success("Event updated successfully!");
    },
  });

  const deleteEvMutation = useMutation({
    mutationFn: deleteEvent,
    onMutate(variables) {
      const deletedEvent = events.find(
        (event) => event.id === variables.eventId
      );
      const newEvents = events.filter(
        (event) => event.id !== variables.eventId
      );
      setEvents(newEvents);
      return deletedEvent;
    },
    onError(error, variables, context) {
      const newEvents = [...events, context!];
      setEvents(newEvents);
      toast.error(error.message || "Failed to delete the event.");
    },
    onSuccess(data, variables, context) {
      toast.success("Event deleted successfully!");
    },
  });

  function handleSelectSlot(data: SlotInfo) {
    const newEvent: MyEvent = {
      id: uuidv4(),
      title: "busy",
      start: data.start,
      end: data.end,
    };

    AddEvMutation.mutate(newEvent);
  }
  console.log("events", events);

  function handleEventResize(data: EventInteractionArgs<MyEvent>) {
    patchEvMutation.mutate({
      id: data.event.id!,
      payload: { start: data.start, end: data.end },
    });
  }

  function handleEventDrop(data: EventInteractionArgs<MyEvent>) {
    patchEvMutation.mutate({
      id: data.event.id!,
      payload: { start: data.start, end: data.end },
    });
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
    deleteEvMutation.mutate({ eventId: selectedEv?.id! });
    setSelectedEv(null);
  }

  return (
    <div>
      <DnDCalendar
        events={events}
        selectable
        localizer={localizer}
        style={{ height: "100vh" }}
        // defaultView="week"
        onEventResize={handleEventResize}
        onEventDrop={handleEventDrop}
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
