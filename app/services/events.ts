import axios from "axios";
import { DBMyEvent, InfoEvent, MyEvent } from "../interfaces";
import { CustomError } from "@/lib/customError";
import { v4 as uuidv4 } from "uuid";
import { TeamMember } from "../store/teams";

interface CreateEventParams {
  userId: string;
  event: MyEvent; // You can replace this with a more specific type later
}

export async function createEvent({
  userId,
  event,
}: CreateEventParams): Promise<string> {
  try {
    const response = await axios.post("/api/events", {
      userId,
      event,
    });

    if (response.status !== 201) {
      throw new Error("Failed to create event");
    }
    const { eventId } = response.data;
    return eventId;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;

      if (status === 401) {
        throw new Error("You must be logged in to create an event.");
      } else if (status === 500) {
        throw new Error(
          "Something went wrong on the server. Please try again later."
        );
      } else {
        throw new Error("Unknown error. Please try again later.");
      }
    }

    throw new Error("Failed to create event. Please try again.");
  }
}

export async function getEvents({
  userId,
}: {
  userId: string;
}): Promise<MyEvent[]> {
  try {
    const response = await axios.get(`/api/events`, {
      params: { userId },
    });

    if (response.status !== 200) {
      throw new Error("Failed to fetch events.");
    }
    let events = response.data.events;
    //db event type to client-side event type
    events = events.map((event: DBMyEvent) => {
      const { start, end, updatedAt, createdAt, _id, ...rest } = event;
      return {
        ...rest,
        start: new Date(start),
        end: new Date(end),
        updatedAt: new Date(updatedAt),
        createdAt: new Date(createdAt),
        id: _id,
      };
    });

    return events;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;

      if (status === 401) {
        throw new Error("You must be logged in to view events.");
      } else if (status === 404) {
        throw new CustomError("Events not found.", 404);
      } else if (status === 500) {
        throw new Error("Server error. Please try again later.");
      } else {
        throw new Error("Unknown error occurred.");
      }
    }

    throw new Error("Failed to fetch events. Please try again.");
  }
}

export async function patchEvent({
  eventId,
  payload,
}: {
  eventId: string;
  payload: MyEvent;
}): Promise<void> {
  try {
    const response = await axios.patch(`/api/events`, payload, {
      params: { eventId },
    });

    if (response.status !== 204) {
      throw new Error("Failed to update the event.");
    }
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;

      if (status === 401) {
        throw new Error("You must be logged in to update the event.");
      } else if (status === 400) {
        throw new CustomError("Event ID is required.", 400);
      } else if (status === 404) {
        throw new CustomError("Event not found.", 404);
      } else if (status === 500) {
        throw new Error("Server error. Please try again later.");
      } else {
        throw new Error("Unknown error occurred.");
      }
    }

    throw new Error("Failed to update the event. Please try again.");
  }
}

export async function deleteEvent({
  eventId,
}: {
  eventId: string;
}): Promise<void> {
  try {
    const response = await axios.delete(`/api/events`, {
      params: { eventId },
    });

    if (response.status !== 204) {
      throw new Error("Failed to delete the event.");
    }
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;

      if (status === 401) {
        throw new Error("You must be logged in to delete the event.");
      } else if (status === 400) {
        throw new CustomError("Event ID is required.", 400);
      } else if (status === 404) {
        throw new CustomError("Event not found.", 404);
      } else if (status === 500) {
        throw new Error("Server error. Please try again later.");
      } else {
        throw new Error("Unknown error occurred.");
      }
    }

    throw new Error("Failed to delete the event. Please try again.");
  }
}

//get info events fn
//parameters - teamId
//return - InfoEvent[]
//GET, url '/api/events/info'
//pass teamId as url param
//check 200, else throw error
//similar error handling but for these codes
//401
//404
//500

export async function getInfoEvents(
  teamId: string
): Promise<{ infoEvents: InfoEvent[]; teamMembers: TeamMember[] }> {
  try {
    const response = await axios.get("/api/events/info", {
      params: { teamId },
    });

    if (response.status !== 200) {
      throw new Error("Failed to fetch event info.");
    }
    let { infoEvents, teamMembers } = response.data;
    //
    infoEvents = infoEvents.map((event: any) => {
      const { start, end, ...rest } = event;
      return {
        ...rest,
        id: uuidv4(),
        start: new Date(start),
        end: new Date(end),
      };
    });
    console.log("team members in service", teamMembers);
    return { infoEvents, teamMembers };
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;

      if (status === 401) {
        throw new Error("You must be logged in to view event info.");
      } else if (status === 404) {
        //404 here means 'Team not found'. check route.ts for clarification.
        throw new Error("Team not found.");
      } else if (status === 500) {
        throw new Error("Server error. Please try again later.");
      } else {
        throw new Error("Unknown error occurred.");
      }
    }

    throw new Error("Failed to fetch event info. Please try again.");
  }
}
