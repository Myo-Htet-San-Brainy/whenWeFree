import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createEvent,
  deleteEvent,
  getEvents,
  getInfoEvents,
  patchEvent,
} from "../services/events";

export const useCreateEventMutation = () => {
  return useMutation({
    mutationFn: createEvent,
  });
};

export const useGetEvents = ({ userId }: { userId?: string }) => {
  userId = userId as string;
  return useQuery({
    queryKey: ["teams"],
    queryFn: () => getEvents({ userId }),
    enabled: Boolean(userId),
  });
};

export const usePatchEvent = () => {
  return useMutation({
    mutationFn: patchEvent,
  });
};

export const useDeleteEvent = () => {
  return useMutation({
    mutationFn: deleteEvent,
  });
};

export const useGetInfoEvents = ({ teamId }: { teamId: string }) => {
  return useQuery({
    queryFn: () => getInfoEvents(teamId),
    queryKey: ["info events", teamId],
    enabled: Boolean(teamId),
  });
};
