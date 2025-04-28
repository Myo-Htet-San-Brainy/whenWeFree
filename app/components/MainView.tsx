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

const fakeUserId = "123";

const MainView = () => {
  const [currTeam, setCurrTeam] = useState<Team | null>(null);
  const createTeamTriggerRef = useRef<null | HTMLButtonElement>(null);
  const joinTeamTriggerRef = useRef<null | HTMLButtonElement>(null);
  const { data: session } = useSession();
  const userId = session?.user.id;

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
      setCurrTeam(teams[0]);
    }
  }, [teams]);
  if (!isError && !teams) {
    return <p>Loading...</p>;
  }
  if (isError) {
    if (error instanceof CustomError) {
      if (error.status === 404) {
        //implement ui
        //appropriate title & description 'u don't have any teams joined. create or join a team to get started etc...'
        return (
          <div>
            <button onClick={() => joinTeamTriggerRef.current?.click()}>
              join Team
            </button>
            <button onClick={() => createTeamTriggerRef.current?.click()}>
              create Team
            </button>

            {/* Dialogs */}
            <CreateTeamDialog triggerRef={createTeamTriggerRef} />
            <JoinTeamDialog triggerRef={joinTeamTriggerRef} />
          </div>
        );
      }
    }
    return <p>{error.message}</p>;
  }
  if (teams.length === 0) {
    return <p>create or join</p>;
  }
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

        <select defaultValue={currTeam._id} onChange={handleSelectTeam}>
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
