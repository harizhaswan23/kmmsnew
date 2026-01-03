import React from "react";

export function Badge({ className = "", ...props }) {
  return (
    <span
      className={
        "px-2 py-1 text-xs rounded-full font-medium inline-block " + className
      }
      {...props}
    />
  );
}
