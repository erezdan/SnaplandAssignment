import React from "react";

export function Switch({ checked, onChange, className = "", ...props }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors 
        ${checked ? "bg-blue-600" : "bg-gray-300"} 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        ${className}
      `}
      {...props}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform 
          ${checked ? "translate-x-6" : "translate-x-1"}
        `}
      />
    </button>
  );
}
