"use client";
import { EventProps } from "react-big-calendar";
import { InfoEvent, MyEvent } from "../interfaces";
import { useTeamMembersStore } from "../store/teams";

// export interface CustomEventProps
//EventProps<MyEvent>
const CustomEvent: React.FC<EventProps<InfoEvent>> = ({ event }) => {
  const { freeMembers: freeMemberIds } = event;
  const { teamMembers } = useTeamMembersStore();

  const freeMembers = freeMemberIds.map((freeMemberId) => {
    const member = teamMembers?.find((val) => val._id === freeMemberId);
    return member;
  });
  const freeMemberNo = freeMembers.length;
  // console.log("free members", freeMembers);
  // console.log("teamMembers", teamMembers);
  // console.log("ids", freeMemberIds);

  return (
    <div className="">
      {freeMembers?.map((member, index) => {
        const pre =
          index === 0 ? false : index === freeMemberNo - 1 ? ", and " : ", ";
        return (
          <i key={member?._id} className="">
            {pre}
            {member?.username}
            {index === freeMemberNo - 1 &&
              `${freeMemberNo > 1 ? " are" : " is"}  free.`}
          </i>
        );
      })}
    </div>
  );
};

export default CustomEvent;
