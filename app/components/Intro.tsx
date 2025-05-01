"use client";
import React, { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { clearCollections } from "../services/clearDb";

const Intro = () => {
  const { data: session } = useSession();
  const router = useRouter();
  function handleSignIn() {
    if (session) {
      router.push("/viewInfo");
      return;
    }
    signIn(undefined, { callbackUrl: "/viewInfo" });
  }

  function handleSignUp() {
    router.push("/signUp");
  }

  return (
    <div>
      <p>intro page</p>
      <button onClick={handleSignIn}>Sign In</button>
      <button onClick={handleSignUp}>Sign Up</button>
      <button onClick={() => clearCollections("nuke")}>clear db</button>
    </div>
  );
};

export default Intro;
