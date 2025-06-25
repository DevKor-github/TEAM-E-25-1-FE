import React from "react";

interface EventImageProps {
  src?: string;
  alt?: string;
  className?: string;
}

export default function EventImage({ src, alt = "", className = "" }: EventImageProps) {
  if (!src) {
    return (
      <div
        className={`bg-white w-[160px] h-[160px] rounded-lg border border-gray-100 flex items-center justify-center ${className}`}
      />
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={`w-[160px] h-[160px] object-cover rounded-lg border border-gray-100 ${className}`}
    />
  );
}
