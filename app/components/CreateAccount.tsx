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
      const response = await axios.post("/api/auth/signUp", data);
      if (response.status !== 201) {
        throw new Error("Oops...Something went wrong. Please try again.");
      }
      console.log("Account created:", response.data);
      toast.success("Account created 🎉.");

      await signIn("credentials", {
        callbackUrl: "/Main/viewInfo",
        username: data.username,
        password: data.password,
      });
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorMsg = error.response?.data?.error || "Something went wrong.";

        if (status === 400) {
          console.log(errorMsg);
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
        toast.error(
          error.message || "Oops...Something went wrong. Please try again."
        );
        router.push("/");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Create Account
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Join to coordinate with your friends
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              {...register("username")}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="mt-2 text-sm text-red-600">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 shadow-md"
          >
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <button
            onClick={() => signIn(undefined, { callbackUrl: "/viewInfo" })}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
