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

interface FindTeamFormProps {
  handleSubmit: any;
  onSubmit: (data: FindTeamFormValues) => void;
  register: UseFormRegister<FindTeamFormValues>;
  errors: FieldErrors<FindTeamFormValues>;
}

export interface FindTeamFormValues {
  joinCode: string;
}

const FindTeamForm: React.FC<FindTeamFormProps> = ({
  handleSubmit,
  onSubmit,
  register,
  errors,
}) => {
  return (
    <div>
      <DialogHeader>
        <DialogTitle>Join a Team</DialogTitle>
        <DialogDescription>
          Join to start checking your friends' free time.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="teamName" className="text-right">
            Join Code
          </Label>
          <Input
            id="teamName"
            {...register("joinCode", { required: "Team name is required" })}
            placeholder="e.g. F7fYa3Yl"
            className={cn("col-span-3", errors.joinCode && "border-red-500")}
          />
        </div>
        {errors.joinCode && (
          <p className="text-red-500 text-sm col-span-4 text-center">
            {errors.joinCode.message}
          </p>
        )}

        <DialogFooter className="mt-4">
          <Button type="submit">Join Team</Button>
        </DialogFooter>
      </form>
    </div>
  );
};

export default FindTeamForm;
