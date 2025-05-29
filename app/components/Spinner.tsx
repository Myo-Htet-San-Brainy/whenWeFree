import { cn } from "@/lib/utils";
import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

const spinnerColor = "oklch(0.511 0.262 276.966)";

const Spinner: React.FC<SpinnerProps> = ({ size = "md", className }) => {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-t-transparent",
        sizeMap[size],
        className
      )}
      style={{
        borderColor: spinnerColor, // base border color
        borderTopColor: "transparent", // keep top transparent to show spinner effect
      }}
    />
  );
};

export default Spinner;
