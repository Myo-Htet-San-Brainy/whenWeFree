import { Event } from "react-big-calendar";

export interface MyEvent extends Event {
  id?: string;
  title?: string;
}
