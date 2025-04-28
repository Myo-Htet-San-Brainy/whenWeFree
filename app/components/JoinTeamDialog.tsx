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

interface JoinTeamDialog {
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const JoinTeamDialog: React.FC<JoinTeamDialog> = ({ triggerRef }) => {
  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<FindTeamFormValues>();
  const [joinCode, setJoinCode] = useState<undefined | string>(undefined);

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
              console.log("Joining team with ID:", data._id);
              mutate({ teamId: data._id, userId });
              resetForm();
              setJoinCode(undefined);
              triggerRef.current?.click();
              // TODO: add actual join mutation here if needed
            }}
          >
            Join
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              resetForm();
              setJoinCode(undefined);
              triggerRef.current?.click();
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
      <Dialog defaultOpen={false}>
        <DialogTrigger className="hidden" ref={triggerRef} />
        <DialogContent className="sm:max-w-[425px]">
          {renderContent()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JoinTeamDialog;
