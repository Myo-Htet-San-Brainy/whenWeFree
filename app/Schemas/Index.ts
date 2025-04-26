import { z } from "zod";

export const formSchema = z.object({
  username: z.string().min(1, "Name is required"),
  password: z.string().min(1, "Password is required"),
});
