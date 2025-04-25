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
