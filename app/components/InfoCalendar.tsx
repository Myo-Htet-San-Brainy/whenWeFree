"use client";
import {
  Calendar,
  SlotInfo,
  momentLocalizer,
  View,
  Views,
} from "react-big-calendar";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
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
  const [view, SetView] = useState<View>(Views.WEEK);
  const { setTeamMembers } = useTeamMembersStore();

  const onNavigate = useCallback(
    (newDate: Date) => {
      return setDate(newDate);
    },
    [setDate]
  );
  const onView = useCallback(
    (newView: View) => {
      return SetView(newView);
    },
    [SetView]
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

  if (!isError && !data) {
    return <p>Loading...</p>;
  }
  if (isError) {
    return <p>Error...</p>;
  }
  const events = data.infoEvents.length <= 0 ? undefined : data.infoEvents;
  console.log("what passed into events", events);

  return (
    <div>
      <Calendar
        className="h-dvh"
        localizer={localizer}
        events={events}
        view={view}
        onView={onView}
        date={date}
        onNavigate={onNavigate}
        eventPropGetter={(ev) => {
          let bgColor;
          if (ev.availabilityRatio === 1) {
            bgColor = "#4CAF50"; // All free
          } else if (ev.availabilityRatio >= 0.5) {
            bgColor = "#FFC107"; // Half or more free
          } else {
            bgColor = "#F44336"; // Less than half free
          }

          return {
            style: {
              backgroundColor: bgColor,
            },
          };
        }}
        tooltipAccessor={(ev) => {
          const { freeMembers: freeMemberIds } = ev;
          const teamMembers = data?.teamMembers;

          let freeMemberNames: string | (string | undefined)[];
          freeMemberNames = freeMemberIds.map((freeMemberId) => {
            const member = teamMembers?.find((val) => val._id === freeMemberId);
            return member?.username;
          });
          freeMemberNames = freeMemberNames.join(",");
          return freeMemberNames;
        }}
      />
    </div>
  );
};

export default InfoCalendar;
