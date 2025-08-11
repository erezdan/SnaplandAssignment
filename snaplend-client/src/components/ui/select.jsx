// src/components/ui/select.jsx
import React from "react";

export function Select({
  value,
  onValueChange,
  children,
  className = "",
  placeholder,
}) {
  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
        className={`appearance-none w-full bg-gray-900 border border-white/30 text-white px-4 py-2 pr-10 rounded-md text-sm ${className}`}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {children}
      </select>

      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

export function SelectItem({ children, ...props }) {
  return <option {...props}>{children}</option>;
}

export const SelectTrigger = ({ children }) => <>{children}</>;
export const SelectContent = ({ children }) => <>{children}</>;
export const SelectValue = ({ children }) => <>{children}</>;
