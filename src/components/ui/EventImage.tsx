import React from "react";

interface EventImageProps {
  src: string;
  alt?: string;
}

export default function EventImage({ src, alt = "" }: EventImageProps) {
  return (    <div className="w-[160px] h-[160px] rounded-[8px] border border-[rgba(3,7,1,0.05)] bg-white overflow-hidden">
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      ) : null}
    </div>
  );
}
