import moment from "moment";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from "../components/Drawer";
import { MyEvent } from "../interfaces";
import { useDialogsStore } from "../store/dialogs";
import { Button } from "./Button";
import { useDeleteEvent } from "../query/event";
import { CustomError } from "@/lib/customError";
import toast from "react-hot-toast";

const EventDetailsDrawer = ({
  events,
  setEvents,
  selectedEv,
  setSelectedEv,
}: {
  events: MyEvent[];
  setEvents: React.Dispatch<React.SetStateAction<MyEvent[]>>;
  selectedEv: MyEvent | null;
  setSelectedEv: React.Dispatch<React.SetStateAction<MyEvent | null>>;
}) => {
  const { isOpenEventDetailsDrawer, setIsOpenEventDetailsDrawer } =
    useDialogsStore();

  const { mutate: deleteEvMutate } = useDeleteEvent();

  function handleDelete() {
    setIsOpenEventDetailsDrawer(false);
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
    <Drawer
      direction="left"
      open={isOpenEventDetailsDrawer}
      onOpenChange={(newState) => setIsOpenEventDetailsDrawer(newState)}
    >
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
  );
};

export default EventDetailsDrawer;
