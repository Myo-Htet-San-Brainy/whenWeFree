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
import { useCallback, useState } from "react";
import { fetchInfoEvents } from "../Mock";
const localizer = momentLocalizer(moment);
interface InfoCalendarProps {
  teamId: string;
}
const InfoCalendar: React.FC<InfoCalendarProps> = ({ teamId }) => {
  const [date, setDate] = useState<Date>(new Date());

  const onNavigate = useCallback(
    (newDate: Date) => {
      return setDate(newDate);
    },
    [setDate]
  );
  const { data: infoEvents, isError } = useQuery({
    queryFn: () => fetchInfoEvents({ teamId: teamId, date: date }),
    queryKey: ["info events", teamId, date],
  });
  if (!isError && !infoEvents) {
    return <p>Loading...</p>;
  }
  if (isError) {
    return <p>Error...</p>;
  }

  return (
    <div>
      <Calendar
        className="h-dvh"
        localizer={localizer}
        events={infoEvents}
        view={Views.DAY}
        date={date}
        onNavigate={onNavigate}
      />
    </div>
  );
};

export default InfoCalendar;
