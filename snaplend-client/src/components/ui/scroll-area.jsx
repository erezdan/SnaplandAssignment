import React from "react";

export function ScrollArea({ className = "", children, style = {}, ...props }) {
  return (
    <div
      className={`relative overflow-auto rounded-md border border-input bg-background shadow-inner ${className}`}
      style={{
        maxHeight: "300px",
        ...style,
      }}
      {...props}
    >
      <div className="pr-2">
        {children}
      </div>

      {/* Custom Scrollbar Styling */}
      <style jsx>{`
        div::-webkit-scrollbar {
          width: 8px;
        }

        div::-webkit-scrollbar-track {
          background: transparent;
        }

        div::-webkit-scrollbar-thumb {
          background-color: #cbd5e1; /* slate-300 */
          border-radius: 9999px;
        }

        div:hover::-webkit-scrollbar-thumb {
          background-color: #94a3b8; /* slate-400 */
        }
      `}</style>
    </div>
  );
}
