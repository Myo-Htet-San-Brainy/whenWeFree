"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "../Schemas/Index";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signIn, signOut, useSession } from "next-auth/react";

// Infer TypeScript type from schema
type FormData = z.infer<typeof formSchema>;

const CreateAccount = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const router = useRouter();

  const { data: session } = useSession();
  useEffect(() => {
    if (session) {
      toast.success(
        "You will have to sign out first to sign up a new account."
      );
      router.push("/viewInfo");
    }
  }, [session]);

  const onSubmit = async (data: FormData) => {
    try {
      // 1. Try creating account first
      const response = await axios.post("/api/auth/signUp", data);
      if (response.status !== 201) {
        throw new Error("Oops...Something went wrong. Please try again.");
      }
      console.log("Account created:", response.data);
      toast.success("Account created 🎉.");

      // 2. After creating, auto sign them in
      await signIn("credentials", {
        callbackUrl: "/viewInfo",
        username: data.username,
        password: data.password,
      });
    } catch (error: any) {
      // Check if it's an axios error
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorMsg = error.response?.data?.error || "Something went wrong.";

        if (status === 400) {
          console.log(errorMsg); // Just console log
        } else if (status === 409) {
          toast("Account already exists! Signing you in...");

          await signIn("credentials", {
            callbackUrl: "/viewInfo",
            username: data.username,
            password: data.password,
          });
        } else if (status === 500) {
          toast.error(errorMsg);
          router.push("/");
        } else {
          toast.error("Unexpected error occurred.");
          router.push("/");
        }
      } else {
        // Not an axios error
        toast.error(
          error.message || "Oops...Something went wrong. Please try again."
        );
        router.push("/");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create Account</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            {...register("username")}
            className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password")}
            className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Create Account
        </button>
      </form>

      {/* Add Sign In link */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => signIn(undefined, { callbackUrl: "/viewInfo" })}
            className="text-indigo-600 hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default CreateAccount;
