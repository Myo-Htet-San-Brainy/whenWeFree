import React from "react";
import { createPortal } from "react-dom";
import Spinner from "./Spinner";

const spinnerRoot =
  typeof window !== "undefined"
    ? document.getElementById("root") || document.body
    : null;

function LoadingSpinner({ top = "50%", left = "50%" }) {
  if (!spinnerRoot) return null;

  const style: React.CSSProperties = {
    position: "absolute",
    top,
    left,
    transform: "translate(-50%, -50%)", // center by default
    zIndex: 9999,
  };

  return createPortal(
    <div style={style}>
      <Spinner size="lg" />
    </div>,
    spinnerRoot
  );
}

export default LoadingSpinner;
