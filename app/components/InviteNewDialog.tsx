"use client";

import { useDialogsStore } from "../store/dialogs";
import { useCurrentTeamStore } from "../store/teams";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/app/components/DialogParts";

const InviteNewDialog = () => {
  const { currentTeam } = useCurrentTeamStore();
  const { isOpenInviteNewDialog, setIsOpenInviteNewDialog } = useDialogsStore();
  return (
    <Dialog
      open={isOpenInviteNewDialog}
      onOpenChange={(newState) => setIsOpenInviteNewDialog(newState)}
    >
      <DialogContent className="sm:max-w-[425px]">
        {currentTeam?.joinCode}
      </DialogContent>
    </Dialog>
  );
};

export default InviteNewDialog;
