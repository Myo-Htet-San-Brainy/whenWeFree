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

  function clearDb() {
    clearCollections("nuke");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
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
          <div className="flex items-center space-x-4">
            <button
              className="text-indigo-700 hover:text-indigo-900 font-medium px-4 py-2"
              onClick={handleSignIn}
            >
              Sign In
            </button>
            <button
              onClick={handleSignUp}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition duration-300"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Find when{" "}
              <span className="text-indigo-600">your group is free</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              See everyone's availability at a glance and plan get-togethers in
              seconds. No more endless messages trying to coordinate schedules.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleSignUp}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium text-lg transition duration-300 shadow-md"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-indigo-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Share Your Times
              </h3>
              <p className="text-gray-600">
                Tell us when you're free by marking your available times in the
                app.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Create Your Group
              </h3>
              <p className="text-gray-600">
                Make a group with friends and have them share their free times
                too.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Find Common Times
              </h3>
              <p className="text-gray-600">
                See when everyone is free together and pick the best time to
                meet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
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
              <span className="text-xl font-bold text-white">When We Free</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-white transition duration-300">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition duration-300">
                Terms
              </a>
              <a href="#" className="hover:text-white transition duration-300">
                FAQ
              </a>
              <a href="#" className="hover:text-white transition duration-300">
                Contact
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            © {new Date().getFullYear()} When We Free. All rights reserved.
          </div>
        </div>
      </footer>
      {/* <button onClick={clearDb}>clear db</button> */}
    </div>
  );
};

export default Intro;
