import React from "react";

export default function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={`h-[1px] w-full bg-gray-100 ${className}`} />
  );
}
