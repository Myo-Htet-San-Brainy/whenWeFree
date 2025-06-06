"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTeam } from "@/app/services/team"; // adjust path if different
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/DialogParts";
import CreateTeamForm, { CreateTeamFormValues } from "./CreateTeamForm";
import { Button } from "@/app/components/Button";
import Spinner from "@/app/components/Spinner"; // you might need a spinner component, or just make one quickly
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useCreateTeamMutation } from "../query/team";
import { useDialogsStore } from "../store/dialogs";

interface CreateTeamDialog {
  onSuccessBtnClick?: () => void;
  onErrorBtnClick?: () => void;
}

const CreateTeamDialog: React.FC<CreateTeamDialog> = ({
  onSuccessBtnClick,
  onErrorBtnClick,
}) => {
  const {
    reset: resetForm,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTeamFormValues>();
  const { isOpenCreateTeamDialog, setIsOpenCreateTeamDialog } =
    useDialogsStore();

  const { mutate, status, data, error, reset } = useCreateTeamMutation();
  const userId = useSession().data?.user.id;

  const onSubmit = (formData: CreateTeamFormValues) => {
    if (!userId) {
      toast.error("Please try again after a moment.");
      setIsOpenCreateTeamDialog(false);
      return;
    }
    mutate({ userId: userId, teamName: formData.teamName });
  };

  const renderContent = () => {
    if (status === "idle") {
      return (
        <CreateTeamForm
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
          <p className="mt-4 text-gray-600">Creating your team...</p>
        </div>
      );
    }

    if (status === "success") {
      return (
        <div className="flex flex-col items-center justify-center py-10 gap-4">
          <p className="text-green-600 text-lg font-semibold">
            Team created successfully! 🎉
          </p>
          <p className="text-center">
            Here's your join code:{" "}
            <span className="font-mono bg-gray-100 p-1 rounded">{data}</span>
          </p>
          <p className="text-center text-sm text-gray-500">
            Share this code with your friends to join your team!
          </p>
          <Button
            onClick={() => {
              onSuccessBtnClick && onSuccessBtnClick();
              resetForm();
              reset();
              setIsOpenCreateTeamDialog(false);
            }}
          >
            Done
          </Button>
        </div>
      );
    }

    if (status === "error") {
      return (
        <div className="flex flex-col items-center justify-center py-10 gap-4">
          <p className="text-red-600 text-lg font-semibold">
            Failed to create team 😢
          </p>
          <p className="text-center text-sm text-gray-500">
            {error?.message || "Something went wrong."}
          </p>
          <Button
            onClick={() => {
              onErrorBtnClick && onErrorBtnClick();
              resetForm();
              reset();
              setIsOpenCreateTeamDialog(false);
            }}
          >
            Ok
          </Button>
        </div>
      );
    }
  };

  return (
    <div>
      <Dialog
        open={isOpenCreateTeamDialog}
        onOpenChange={(newState) => setIsOpenCreateTeamDialog(newState)}
      >
        <DialogContent className="sm:max-w-[425px]">
          {renderContent()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateTeamDialog;
