import React from "react";

export function Card({ children, className = "" }) {
  return <div className={"bg-gray-800 rounded-xl shadow p-4 " + className}>{children}</div>;
}

export function CardContent({ children, className = "" }) {
  return <div className={"p-2 " + className}>{children}</div>;
}

export function CardHeader({ children, className = "" }) {
  return <div className={"mb-2 " + className}>{children}</div>;
}

export function CardTitle({ children, className = "" }) {
  return <h2 className={"text-lg font-bold " + className}>{children}</h2>;
} 