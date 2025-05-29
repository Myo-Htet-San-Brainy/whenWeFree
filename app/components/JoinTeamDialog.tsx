"use client";

import { useForm } from "react-hook-form";
import { useGetTeam, useJoinTeamMutation } from "@/app/query/team"; // adjust path if diff
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/app/components/DialogParts";
import CreateTeamForm from "./CreateTeamForm"; // reuse the form, just rename props later if u want
import { Button } from "@/app/components/Button";
import Spinner from "@/app/components/Spinner";
import { useState } from "react";
import FindTeamForm, { FindTeamFormValues } from "./FindTeamForm";
import { useSession } from "next-auth/react";
import { useDialogsStore } from "../store/dialogs";

interface JoinTeamDialog {
  onJoinSuccess?: () => void;
}

const JoinTeamDialog: React.FC<JoinTeamDialog> = ({ onJoinSuccess }) => {
  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<FindTeamFormValues>();
  const [joinCode, setJoinCode] = useState<undefined | string>(undefined);
  const { isOpenJoinTeamDialog, setIsOpenJoinTeamDialog } = useDialogsStore();

  const { status, data, error } = useGetTeam({ joinCode });
  const { mutate } = useJoinTeamMutation();
  const { data: session } = useSession();
  const userId = session?.user.id || "123";

  const onSubmit = (formData: FindTeamFormValues) => {
    setJoinCode(formData.joinCode);
  };

  const renderContent = () => {
    if (!joinCode) {
      return (
        <FindTeamForm
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          register={register}
          errors={errors}
        />
      );
    }

    if (status === "pending") {
      return (
        <div className="flex flex-col items-center justify-center py-10">
          <Spinner />
          <p className="mt-4 text-gray-600">Finding your team...</p>
        </div>
      );
    }

    if (status === "success") {
      return (
        <div className="flex flex-col items-center justify-center py-10 gap-4">
          <p className="text-green-600 text-lg font-semibold">
            You are about to join team:
          </p>
          <p className="text-center font-bold text-xl">{data.teamName}</p>
          <Button
            onClick={() => {
              mutate(
                { teamId: data._id, userId },
                {
                  onSuccess(data, variables, context) {
                    onJoinSuccess && onJoinSuccess();
                  },
                }
              );
              resetForm();
              setJoinCode(undefined);
              setIsOpenJoinTeamDialog(false);
            }}
          >
            Join
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              resetForm();
              setJoinCode(undefined);
              setIsOpenJoinTeamDialog(false);
            }}
          >
            Cancel
          </Button>
        </div>
      );
    }

    if (status === "error") {
      return (
        <div className="flex flex-col items-center justify-center py-10 gap-4">
          <p className="text-red-600 text-lg font-semibold">
            Failed to find team 😢
          </p>
          <p className="text-center text-sm text-gray-500">
            {error?.message || "Team not found. Double-check the join code!"}
          </p>
          <Button
            onClick={() => {
              resetForm();
              setJoinCode(undefined);
            }}
          >
            Try Again
          </Button>
        </div>
      );
    }
  };

  return (
    <div>
      <Dialog
        open={isOpenJoinTeamDialog}
        onOpenChange={(newState) => setIsOpenJoinTeamDialog(newState)}
      >
        <DialogContent className="sm:max-w-[425px]">
          {renderContent()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JoinTeamDialog;
