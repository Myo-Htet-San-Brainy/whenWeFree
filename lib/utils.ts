import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Complementary function to verify passwords
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
