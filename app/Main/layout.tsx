"use client";

import MainMenu from "../components/MainMenu";
import Navbar from "../components/Navbar";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      {/* NAVBAR */}
      <Navbar />
      {children}
    </div>
  );
};

export default layout;
