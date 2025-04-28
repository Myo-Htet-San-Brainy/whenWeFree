"use client";
import React, { useEffect, useRef, useState } from "react";
import InfoCalendar from "../components/InfoCalendar";
import { useQuery } from "@tanstack/react-query";
import { fetchTeamsByUserId, Team } from "../Mock";
import { useSession, signIn, signOut } from "next-auth/react";
import CreateTeamDialog from "./CreateTeamDialog";
import JoinTeamDialog from "./JoinTeamDialog";

const fakeUserId = "123";

const MainView = () => {
  const [currTeam, setCurrTeam] = useState<Team | null>(null);
  const createTeamTriggerRef = useRef<null | HTMLButtonElement>(null);
  const joinTeamTriggerRef = useRef<null | HTMLButtonElement>(null);

  const {
    data: teams,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["teams"],
    queryFn: () => fetchTeamsByUserId(fakeUserId),
  });
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
    return <p>Error...</p>;
  }
  if (teams.length === 0) {
    return <p>create or join</p>;
  }
  if (currTeam === null) {
    return <p>...loading</p>;
  }

  function handleSelectTeam(e: React.ChangeEvent<HTMLSelectElement>) {
    const newTeamId = e.currentTarget.value;
    const newTeam = teams?.find((team) => team.id === newTeamId);
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

        <select defaultValue={currTeam.id} onChange={handleSelectTeam}>
          {teams.map((team) => (
            <option value={team.id} key={team.id}>
              {team.name}
            </option>
          ))}
        </select>
        <div>
          <button onClick={() => signOut()}>sign out</button>
        </div>
      </div>
      <InfoCalendar teamId={currTeam.id} />
      {/* Dialogs */}
      <CreateTeamDialog triggerRef={createTeamTriggerRef} />
      <JoinTeamDialog triggerRef={joinTeamTriggerRef} />
    </div>
  );
};

export default MainView;
