import { cn } from "@/lib/utils"; // only if you use clsx/cn pattern
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

const Spinner: React.FC<SpinnerProps> = ({ size = "md", className }) => {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-t-transparent border-gray-400",
        sizeMap[size],
        className
      )}
    />
  );
};

export default Spinner;
