import { create } from "zustand";
import { Team } from "../services/team";

export interface TeamMember {
  _id: string;
  username: string;
}

interface TeamMembersStore {
  teamMembers: null | TeamMember[];
  setTeamMembers: (newState: TeamMember[]) => void;
}

export const useTeamMembersStore = create<TeamMembersStore>()((set) => ({
  teamMembers: null,
  setTeamMembers: (newState) => {
    set((prev) => {
      return { ...prev, teamMembers: newState };
    });
  },
}));

interface CurrentTeamStore {
  currentTeam: null | Team;
  setCurrentTeam: (newState: Team) => void;
}

export const useCurrentTeamStore = create<CurrentTeamStore>()((set) => ({
  currentTeam: null,
  setCurrentTeam: (newState) => {
    set((prev) => {
      return { ...prev, currentTeam: newState };
    });
  },
}));
