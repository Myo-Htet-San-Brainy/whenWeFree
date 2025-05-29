import React from "react";
import { useDialogsStore } from "../store/dialogs";
import CreateTeamDialog from "./CreateTeamDialog";
import JoinTeamDialog from "./JoinTeamDialog";
import MainMenu from "./MainMenu";

const Navbar = () => {
  const {
    setIsOpenCreateTeamDialog,
    setIsOpenJoinTeamDialog,
    setIsOpenMainMenuDrawer,
  } = useDialogsStore();
  return (
    <div>
      <div className="bg-white border-b border-gray-200 px-6 py-4 mb-4">
        <div className="flex justify-between items-center">
          {/* Left side - Logo and app name */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
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
            <span className="text-xl font-bold text-indigo-800">
              When We Free
            </span>
          </div>

          {/* Right side - All navigation elements */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsOpenJoinTeamDialog(true)}
              className="text-indigo-600 hover:text-indigo-800 font-medium px-4 py-2 rounded-lg transition duration-200"
            >
              Join Team
            </button>
            <button
              onClick={() => setIsOpenCreateTeamDialog(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition duration-200 shadow-sm"
            >
              Create Team
            </button>
            <button
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition duration-200 shadow-sm"
              onClick={() => setIsOpenMainMenuDrawer(true)}
            >
              <span>Menu</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* MAIN MENU/ SETTINGS */}
      <MainMenu />
      {/* Dialogs */}
      <CreateTeamDialog />
      <JoinTeamDialog />
    </div>
  );
};

export default Navbar;
