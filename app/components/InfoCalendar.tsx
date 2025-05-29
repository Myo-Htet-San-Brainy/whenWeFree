"use client";
import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";

import "react-big-calendar/lib/css/react-big-calendar.css";

import { useCallback, useEffect, useState } from "react";

import { useGetInfoEvents } from "../query/event";
import toast from "react-hot-toast";

import { useTeamMembersStore } from "../store/teams";
import Link from "next/link";
import LoadingSpinner from "./LoadingSpinner";
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
      setTeamMembers(data.teamMembers);
      if (data.infoEvents.length <= 0) {
        //this is misleading
        toast.error("No free time added by team members.");
      }
    }
  }, [data]);

  if ((!isError && !data) || isLoading) {
    return <LoadingSpinner top="60%" left="50%" />;
  }
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-gray-700 text-center px-4">
        <h2 className="text-2xl font-semibold mb-4">
          Oops! Something went wrong.
        </h2>
        <p className="mb-1 text-lg">Check out another team</p>
        <p className="mb-1 text-gray-500">or</p>
        <Link href={"/Main/fillInData"} className="text-lg">
          Add your free time first
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
