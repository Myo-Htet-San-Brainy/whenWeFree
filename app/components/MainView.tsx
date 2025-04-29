"use client";
import React, { useEffect, useRef, useState } from "react";
import InfoCalendar from "../components/InfoCalendar";
import { useQuery } from "@tanstack/react-query";

import { useSession, signIn, signOut } from "next-auth/react";
import CreateTeamDialog from "./CreateTeamDialog";
import JoinTeamDialog from "./JoinTeamDialog";
import { useGetTeams } from "../query/team";
import { Team } from "../services/team";
import { CustomError } from "@/lib/customError";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const fakeUserId = "123";

const MainView = () => {
  const [currTeam, setCurrTeam] = useState<Team | null>(null);
  const createTeamTriggerRef = useRef<null | HTMLButtonElement>(null);
  const joinTeamTriggerRef = useRef<null | HTMLButtonElement>(null);
  const { data: session } = useSession();
  const userId = session?.user.id;
  const router = useRouter();

  const {
    data: teams,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useGetTeams({ userId });
  console.log("teams", teams);

  useEffect(() => {
    if (teams !== undefined) {
      const reversed = [...teams].reverse();
      setCurrTeam(reversed[0]);
    }
  }, [teams]);

  useEffect(() => {
    if (isError || error) {
      if (error instanceof CustomError && error.status === 404) {
        router.push("/createOrJoinATeam");
      } else {
        toast.error(
          "Something goes wrong. Please fill in your free time first."
        );
        router.push("/fillInData");
      }
    }
  }, [isError, error]);
  if ((!isError && !teams) || isLoading) {
    return <p>Loading...</p>;
  }
  if (isError || error) {
    //error handling in useFx as it involves navigating
    return;
  }
  // if (isError) {
  //   if (error instanceof CustomError) {
  //     if (error.status === 404) {
  //       router.push("/createOrJoinATeam");
  //       return;
  //       implement ui
  //       appropriate title & description 'u don't have any teams joined. create or join a team to get started etc...'
  //       return (
  //         <div>
  //           <button onClick={() => joinTeamTriggerRef.current?.click()}>
  //             join Team
  //           </button>
  //           <button onClick={() => createTeamTriggerRef.current?.click()}>
  //             create Team
  //           </button>

  //           {/* Dialogs */}
  //           <CreateTeamDialog triggerRef={createTeamTriggerRef} />
  //           <JoinTeamDialog triggerRef={joinTeamTriggerRef} />
  //         </div>
  //       );
  //     }
  //   }
  //   //please fill in data first for now...
  //   return <p>{error.message}</p>;
  // }
  if (currTeam === null) {
    return <p>...loading</p>;
  }

  function handleSelectTeam(e: React.ChangeEvent<HTMLSelectElement>) {
    const newTeamId = e.currentTarget.value;
    const newTeam = teams?.find((team) => team._id === newTeamId);
    setCurrTeam(newTeam!);
  }

  return (
    <div>
      <div className="flex justify-end">
        <button onClick={() => joinTeamTriggerRef.current?.click()}>
          join Team
        </button>
        <button onClick={() => createTeamTriggerRef.current?.click()}>
          create Team
        </button>

        <select value={currTeam._id} onChange={handleSelectTeam}>
          {teams.map((team) => (
            <option value={team._id} key={team._id}>
              {team.teamName}
            </option>
          ))}
        </select>
        <div>
          <button onClick={() => signOut()}>sign out</button>
        </div>
      </div>
      <InfoCalendar teamId={currTeam._id} />
      {/* Dialogs */}
      <CreateTeamDialog triggerRef={createTeamTriggerRef} />
      <JoinTeamDialog triggerRef={joinTeamTriggerRef} />
    </div>
  );
};

export default MainView;
