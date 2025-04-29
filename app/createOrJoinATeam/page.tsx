"use client";

import { useRef } from "react";
import Link from "next/link";
import CreateTeamDialog from "../components/CreateTeamDialog";
import JoinTeamDialog from "../components/JoinTeamDialog";
import { useRouter } from "next/navigation";

const Page = () => {
  const createTeamTriggerRef = useRef<null | HTMLButtonElement>(null);
  const joinTeamTriggerRef = useRef<null | HTMLButtonElement>(null);
  const router = useRouter();
  function onSuccessBtnClick() {
    router.push("/viewInfo");
  }

  function onJoinSuccess() {
    router.push("/viewInfo");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-gray-800">
          You haven’t joined any team.
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          You haven’t joined or created any teams yet. To get started, either
          create a new team or join an existing one.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => joinTeamTriggerRef.current?.click()}
            className="w-full rounded-xl bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          >
            Join a Team
          </button>
          <button
            onClick={() => createTeamTriggerRef.current?.click()}
            className="w-full rounded-xl border border-blue-600 px-4 py-2 text-blue-600 transition hover:bg-blue-50"
          >
            Create a Team
          </button>

          <div className="relative mt-4 text-center text-sm text-gray-500">
            <span className="absolute left-0 top-1/2 h-px w-full bg-gray-200 -translate-y-1/2" />
            <span className="relative z-10 bg-white px-2">or</span>
          </div>

          <Link
            href="/fillInData"
            className="text-center text-sm text-blue-600 hover:underline"
          >
            Fill in your free time first
          </Link>
        </div>

        {/* Dialogs */}
        <CreateTeamDialog
          triggerRef={createTeamTriggerRef}
          onSuccessBtnClick={onSuccessBtnClick}
        />
        <JoinTeamDialog
          triggerRef={joinTeamTriggerRef}
          onJoinSuccess={onJoinSuccess}
        />
      </div>
    </div>
  );
};

export default Page;
