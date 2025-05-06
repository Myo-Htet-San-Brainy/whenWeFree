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
import Link from "next/link";
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

  const { data, isError, isLoading } = useGetInfoEvents({ teamId });

  useEffect(() => {
    if (data) {
      if (data.infoEvents.length <= 0) {
        toast.error("Members haven't filled their free time yet");
      } else {
        //server includes 'teamMembers' only when infoEvents.length is > 0
        setTeamMembers(data.teamMembers);
      }
    }
  }, [data]);

  if ((!isError && !data) || isLoading) {
    return <p>Loading...</p>;
  }
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-gray-700 text-center px-4">
        <h2 className="text-2xl font-semibold mb-4">
          Oops! Something went wrong.
        </h2>
        <p className="mb-1 text-lg">Check out another team's free time</p>
        <p className="mb-1 text-gray-500">or</p>
        <Link href={"/fillInData"} className="text-lg">
          Fill in your free time first
        </Link>
      </div>
    );
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
