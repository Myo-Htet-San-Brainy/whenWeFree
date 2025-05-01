"use client";
import {
  Calendar,
  SlotInfo,
  momentLocalizer,
  View,
  Views,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { MyEvent } from "../interfaces";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { fetchInfoEvents } from "../Mock";
import { useGetInfoEvents } from "../query/event";
import toast from "react-hot-toast";
import CustomEvent from "./CustomEvent";
import { useTeamMembersStore } from "../store/teams";
const localizer = momentLocalizer(moment);
interface InfoCalendarProps {
  teamId: string;
}
const InfoCalendar: React.FC<InfoCalendarProps> = ({ teamId }) => {
  const [date, setDate] = useState<Date>(new Date());
  const { setTeamMembers } = useTeamMembersStore();

  const onNavigate = useCallback(
    (newDate: Date) => {
      return setDate(newDate);
    },
    [setDate]
  );
  const { data, isError } = useGetInfoEvents({ teamId });

  useEffect(() => {
    if (data) {
      if (data.infoEvents.length <= 0) {
        toast.error("Members haven't filled their free time yet");
      } else {
        setTeamMembers(data.teamMembers);
      }
    }
  }, [data]);

  console.log("info events", data?.infoEvents);
  if (!isError && !data) {
    return <p>Loading...</p>;
  }
  if (isError) {
    return <p>Error...</p>;
  }
  const events = data.infoEvents.length <= 0 ? undefined : data.infoEvents;
  console.log("what passed into evnts", events);

  return (
    <div>
      <Calendar
        className="h-dvh"
        localizer={localizer}
        events={events}
        view={Views.DAY}
        date={date}
        onNavigate={onNavigate}
        components={{
          event: CustomEvent,
        }}
      />
    </div>
  );
};

export default InfoCalendar;
