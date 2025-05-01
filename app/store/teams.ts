import { create } from "zustand";

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
