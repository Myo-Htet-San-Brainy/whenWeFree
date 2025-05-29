"use client";
import React, { useEffect } from "react";
import InfoCalendar from "../components/InfoCalendar";

import { useSession } from "next-auth/react";
import { useGetTeams } from "../query/team";

import { useCurrentTeamStore } from "../store/teams";

import Link from "next/link";
import LoadingSpinner from "./LoadingSpinner";

const MainView = () => {
  const { currentTeam, setCurrentTeam } = useCurrentTeamStore();
  const { data: session } = useSession();
  const userId = session?.user.id;

  const { data: teams, isLoading, isError, error } = useGetTeams({ userId });
  console.log("teams", teams);

  useEffect(() => {
    if (teams !== undefined) {
      if (teams.length > 0) {
        const reversed = [...teams].reverse();
        setCurrentTeam(reversed[0]);
      }
    }
  }, [teams]);

  if ((!isError && !teams) || isLoading) {
    return <LoadingSpinner top="60%" left="50%" />;
  }
  if (isError || error) {
    return (
      <div>
        some error happened.
        <Link href={"/fillInData"}>Add your time first...</Link>
      </div>
    );
  }
  if (teams.length <= 0) {
    return <p>U r not in any team yet, Pls create or join existing one.</p>;
  }
  if (currentTeam === null) {
    return <LoadingSpinner top="60%" left="50%" />;
  }

  function handleSelectTeam(e: React.ChangeEvent<HTMLSelectElement>) {
    const newTeamId = e.currentTarget.value;
    const newTeam = teams?.find((team) => team._id === newTeamId);
    setCurrentTeam(newTeam!);
  }

  return (
    <div>
      <div className="pb-2 px-6 flex justify-end">
        <select
          value={currentTeam._id}
          onChange={handleSelectTeam}
          className=" bg-indigo-50 border border-indigo-100 text-indigo-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
        >
          {teams.map((team) => (
            <option value={team._id} key={team._id}>
              {team.teamName}
            </option>
          ))}
        </select>
      </div>
      <InfoCalendar teamId={currentTeam._id} />
    </div>
  );
};

export default MainView;
