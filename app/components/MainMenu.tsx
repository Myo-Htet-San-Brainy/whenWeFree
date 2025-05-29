import React from "react";

import {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from "../components/Drawer";
import { Plus, Eye, CircleArrowOutUpRight, LogOut, Divide } from "lucide-react";
import { useDialogsStore } from "../store/dialogs";
import { useLeaveTeamMutation } from "../query/team";
import { useCurrentTeamStore } from "../store/teams";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Link from "next/link";
import InviteNewDialog from "./InviteNewDialog";
import ViewMembersDialog from "./ViewMembersDialog";
import { usePathname } from "next/navigation";

const MainMenu = () => {
  const {
    isOpenMainMenuDrawer,
    setIsOpenMainMenuDrawer,
    setIsOpenInviteNewDialog,
    setIsOpenViewMembersDialog,
  } = useDialogsStore();

  const { mutate: leaveTeamMutate } = useLeaveTeamMutation();
  const { currentTeam } = useCurrentTeamStore();
  const { data: session } = useSession();
  const userId = session?.user.id;
  function handleLeaveTeam() {
    if (!currentTeam || !userId) {
      toast.error("Leaving failed. Pls try again later.");
      return;
    }
    setIsOpenMainMenuDrawer(false);
    leaveTeamMutate({
      teamId: currentTeam?._id,
      userId: userId,
    });
  }

  const pathname = usePathname();
  const isOnFillInData = pathname === "/Main/fillInData";
  const isShowCurrCircleSettings = !isOnFillInData && !!currentTeam;

  return (
    <div>
      <Drawer
        direction="left"
        open={isOpenMainMenuDrawer}
        onOpenChange={(newState) => setIsOpenMainMenuDrawer(newState)}
      >
        <DrawerContent>
          <DrawerHeader className="w-[400px]">
            <DrawerTitle className="flex justify-between">
              <h1>Settings</h1>
              <DrawerClose>close</DrawerClose>
            </DrawerTitle>
            <DrawerDescription className="">
              {isShowCurrCircleSettings && (
                <div>
                  <p className="mt-2 text-left text-sm bg-slate-300 p-2">
                    Current Circle Settings
                  </p>
                  <button
                    className="mt-2 w-full p-2 flex gap-2 hover:bg-slate-200 transition-colors"
                    onClick={() => setIsOpenViewMembersDialog(true)}
                  >
                    <Eye />
                    View Members
                  </button>
                  <button
                    className="mt-2 w-full p-2 flex gap-2 hover:bg-slate-200 transition-colors"
                    onClick={() => setIsOpenInviteNewDialog(true)}
                  >
                    <Plus />
                    Invite New Member
                  </button>
                  <button
                    className="mt-2 w-full p-2 flex gap-2 hover:bg-slate-200 transition-colors"
                    onClick={handleLeaveTeam}
                  >
                    <CircleArrowOutUpRight />
                    Leave Team
                  </button>
                </div>
              )}
              <div>
                <p className="mt-2 text-left text-sm bg-slate-300 p-2">
                  Universal Settings
                </p>
                <Link
                  href={"/Main/viewInfo"}
                  onClick={() => setIsOpenMainMenuDrawer(false)}
                  className="mt-2 w-full p-2 flex gap-2 hover:bg-slate-200 transition-colors"
                >
                  <Eye />
                  Check when we free
                </Link>
                <Link
                  href={"/Main/fillInData"}
                  onClick={() => setIsOpenMainMenuDrawer(false)}
                  className="mt-2 w-full p-2 flex gap-2 hover:bg-slate-200 transition-colors"
                >
                  <Plus />
                  Add My Free Time
                </Link>
                <button
                  className="mt-2 w-full p-2 flex gap-2 hover:bg-slate-200 transition-colors"
                  onClick={() => signOut()}
                >
                  <LogOut />
                  Sign Out
                </button>
              </div>
            </DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
      {/* Dialogs */}
      <InviteNewDialog />
      <ViewMembersDialog />
    </div>
  );
};

export default MainMenu;
