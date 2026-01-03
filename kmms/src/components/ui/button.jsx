import React from "react";

export function Button({ className = "", ...props }) {
  return (
    <button
      className={
        "px-4 py-2 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition " +
        className
      }
      {...props}
    />
  );
}
