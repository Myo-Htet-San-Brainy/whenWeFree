import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "./DialogParts";
import { Input } from "@/app/components/Input";
import { Label } from "@/app/components/Label";
import { Button } from "@/app/components/Button";
import { cn } from "@/lib/utils"; // optional: if you use clsx helper

import { UseFormRegister, FieldErrors } from "react-hook-form";

interface CreateTeamFormProps {
  handleSubmit: any;
  onSubmit: (data: CreateTeamFormValues) => void;
  register: UseFormRegister<CreateTeamFormValues>;
  errors: FieldErrors<CreateTeamFormValues>;
}

export interface CreateTeamFormValues {
  teamName: string;
}
const CreateTeamForm: React.FC<CreateTeamFormProps> = ({
  handleSubmit,
  onSubmit,
  register,
  errors,
}) => {
  return (
    <div>
      <DialogHeader>
        <DialogTitle>Create a Team</DialogTitle>
        <DialogDescription>
          Create a team and ask your friends to join to start checking free
          time.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="teamName" className="text-right">
            Team Name
          </Label>
          <Input
            id="teamName"
            {...register("teamName", { required: "Team name is required" })}
            placeholder="e.g. Avengers"
            className={cn("col-span-3", errors.teamName && "border-red-500")}
          />
        </div>
        {errors.teamName && (
          <p className="text-red-500 text-sm col-span-4 text-center">
            {errors.teamName.message}
          </p>
        )}

        <DialogFooter className="mt-4">
          <Button type="submit">Create Team</Button>
        </DialogFooter>
      </form>
    </div>
  );
};

export default CreateTeamForm;
