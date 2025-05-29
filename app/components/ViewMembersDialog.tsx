"use client";

import { useDialogsStore } from "../store/dialogs";
import { useTeamMembersStore } from "../store/teams";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/app/components/DialogParts";

const ViewMembersDialog = () => {
  const { teamMembers } = useTeamMembersStore();
  const { isOpenViewMembersDialog, setIsOpenViewMembersDialog } =
    useDialogsStore();
  console.log("teamMembers at pipe end", teamMembers);
  return (
    <Dialog
      open={isOpenViewMembersDialog}
      onOpenChange={(newState) => setIsOpenViewMembersDialog(newState)}
    >
      <DialogContent className="sm:max-w-[425px]">
        {teamMembers?.map((member) => {
          return <p key={member._id}>{member.username}</p>;
        })}
      </DialogContent>
    </Dialog>
  );
};

export default ViewMembersDialog;
