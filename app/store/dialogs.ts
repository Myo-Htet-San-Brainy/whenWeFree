import { create } from "zustand";

interface DialogsStore {
  isOpenInviteNewDialog: boolean;
  setIsOpenInviteNewDialog: (newState: boolean) => void;
  isOpenViewMembersDialog: boolean;
  setIsOpenViewMembersDialog: (newState: boolean) => void;
  isOpenCreateTeamDialog: boolean;
  setIsOpenCreateTeamDialog: (newState: boolean) => void;
  isOpenJoinTeamDialog: boolean;
  setIsOpenJoinTeamDialog: (newState: boolean) => void;
  isOpenMainMenuDrawer: boolean;
  setIsOpenMainMenuDrawer: (newState: boolean) => void;
  isOpenEventDetailsDrawer: boolean;
  setIsOpenEventDetailsDrawer: (newState: boolean) => void;
}

export const useDialogsStore = create<DialogsStore>()((set) => ({
  isOpenInviteNewDialog: false,
  setIsOpenInviteNewDialog: (newState) => {
    set((prev) => {
      return { ...prev, isOpenInviteNewDialog: newState };
    });
  },
  isOpenViewMembersDialog: false,
  setIsOpenViewMembersDialog: (newState) => {
    set((prev) => {
      return { ...prev, isOpenViewMembersDialog: newState };
    });
  },
  isOpenCreateTeamDialog: false,
  setIsOpenCreateTeamDialog: (newState) => {
    set((prev) => {
      return { ...prev, isOpenCreateTeamDialog: newState };
    });
  },
  isOpenJoinTeamDialog: false,
  setIsOpenJoinTeamDialog: (newState) => {
    set((prev) => {
      return { ...prev, isOpenJoinTeamDialog: newState };
    });
  },
  isOpenMainMenuDrawer: false,
  setIsOpenMainMenuDrawer: (newState) => {
    set((prev) => {
      return { ...prev, isOpenMainMenuDrawer: newState };
    });
  },
  isOpenEventDetailsDrawer: false,
  setIsOpenEventDetailsDrawer: (newState) => {
    set((prev) => {
      return { ...prev, isOpenEventDetailsDrawer: newState };
    });
  },
}));
