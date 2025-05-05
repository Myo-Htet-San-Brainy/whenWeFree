import { DBMyEvent, InfoEvent, MyEvent } from "@/app/interfaces";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function transformEventsToInfoEvents(
  events: DBMyEvent[],
  noOfAllMembers: number
): InfoEvent[] {
  if (events.length === 0) return [];

  // Convert string dates to Date objects for easier manipulation
  const normalizedEvents = events.map((event) => ({
    start: new Date(event.start),
    end: new Date(event.end),
    createdBy: event.createdBy,
  }));

  // Find all unique time points (start and end times)
  let timePoints: Date[] = [];
  normalizedEvents.forEach((event) => {
    timePoints.push(event.start);
    timePoints.push(event.end);
  });

  // Sort timePoints chronologically and remove duplicates
  timePoints = Array.from(new Set(timePoints.map((date) => date.getTime())))
    .map((time) => new Date(time))
    .sort((a, b) => a.getTime() - b.getTime());

  const infoEvents: InfoEvent[] = [];

  // For each consecutive pair of time points, create an info event
  for (let i = 0; i < timePoints.length - 1; i++) {
    const currentStart = timePoints[i];
    const currentEnd = timePoints[i + 1];

    // Skip if the start and end times are the same
    if (currentStart.getTime() === currentEnd.getTime()) continue;

    // Find which members are free during this time block
    const freeMembers = normalizedEvents
      .filter(
        (event) =>
          // A member is free if their free time event fully contains this time block
          // or overlaps with it
          (event.start <= currentStart && event.end >= currentEnd) ||
          (event.start <= currentStart && event.end > currentStart) ||
          (event.start < currentEnd && event.end >= currentEnd) ||
          (event.start >= currentStart && event.end <= currentEnd)
      )
      .map((event) => event.createdBy);

    // Remove duplicates from freeMembers (in case of multiple overlapping events for same person)
    const uniqueFreeMembers = [...new Set(freeMembers)];

    // Only create an info event if at least one person is free
    if (uniqueFreeMembers.length > 0) {
      infoEvents.push({
        start: currentStart,
        end: currentEnd,
        freeMembers: uniqueFreeMembers as string[],
        availabilityRatio: uniqueFreeMembers.length / noOfAllMembers,
      });
    }
  }

  return infoEvents;
}
