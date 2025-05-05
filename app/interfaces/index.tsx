import { Event } from "react-big-calendar";

export interface MyEvent extends Event {
  id?: string;
  title?: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DBMyEvent
  extends Omit<MyEvent, "start" | "end" | "createdAt" | "updatedAt" | "_id"> {
  start: string;
  end: string;
  createdAt: string;
  updatedAt: string;
  _id: string;
}

export interface InfoEvent {
  start: Date;
  end: Date;
  freeMembers: string[];
  availabilityRatio: number;
}
