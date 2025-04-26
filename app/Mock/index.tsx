import { resolve } from "path";
import { MyEvent } from "../interfaces";
import { v4 as uuidv4 } from "uuid";

export async function addEvent(event: any) {
  return new Promise<string>((resolve, reject) =>
    setTimeout(() => {
      resolve(uuidv4());
      // reject("some err");
    }, 3000)
  );
}

export async function patchEvent({
  id,
  payload,
}: {
  id: string;
  payload: any;
}) {
  const res = await new Promise<MyEvent>((resolve) =>
    setTimeout(
      () =>
        resolve({
          id: uuidv4(),
          start: new Date(),
          end: new Date(),
          title: "busy",
        }),
      3000
    )
  );
  const random = Math.floor(Math.random() * 2) + 1;
  if (random === 1) {
    return res;
  } else {
    throw new Error("Error!");
  }
}

export async function deleteEvent({
  eventId,
}: {
  eventId: string;
}): Promise<MyEvent> {
  const res = await new Promise<MyEvent>((resolve) =>
    setTimeout(
      () =>
        resolve({
          id: uuidv4(),
          start: new Date(),
          end: new Date(),
          title: "busy",
        }),
      2000
    )
  );
  const random = Math.floor(Math.random() * 2) + 1;
  if (random === 1) {
    return res;
  } else {
    throw new Error("Error!");
  }
}

export async function fetchInfoEvents({
  teamId,
  date,
}: {
  teamId: string;
  date: Date;
}): Promise<MyEvent[]> {
  const res = await new Promise<MyEvent[]>((resolve) =>
    setTimeout(() => resolve(generateFakeEvents(date)), 2000)
  );
  return res;
}

export interface Team {
  id: string;
  name: string;
}
const teams = [
  {
    id: uuidv4(),
    name: "team A",
  },
  {
    id: uuidv4(),
    name: "team B",
  },
];
export async function fetchTeamsByUserId(userId: string): Promise<Team[]> {
  const res = await new Promise<Team[]>((resolve) =>
    setTimeout(() => resolve(teams), 2000)
  );
  return res;
}

function generateFakeEvents(date: Date): MyEvent[] {
  const hours = [9, 11, 14, 16]; // 4 events: 9AM, 11AM, 2PM, 4PM

  return hours.map((hour, index) => {
    const start = new Date(date);
    start.setHours(hour, 0, 0, 0);

    const end = new Date(date);
    end.setHours(hour + 1, 0, 0, 0); // each event is 1hr

    return {
      id: uuidv4(),
      title: `Event ${index + 1}`,
      start,
      end,
    };
  });
}
