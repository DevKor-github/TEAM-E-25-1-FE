// src/components/ui/CalendarMargin.tsx
import React from 'react';
import { cn } from '@/lib/utils';

// Define the simplified prop interface matching the design logic
// The design uses "nearbyItemOnMonth" boolean to toggle bg color
interface CalendarMarginProps extends React.HTMLAttributes<HTMLDivElement> {
  nearbyItemOnMonth?: boolean;
}

export default function CalendarMargin({
  nearbyItemOnMonth = true,
  className,
  ...props
}: CalendarMarginProps) {
  // Logic: 
  // - If nearbyItemOnMonth is true (default), background is white.
  // - If false, background is #f3f4f6 (grayish).
  
  const bgColor = nearbyItemOnMonth ? "bg-white" : "bg-[#f3f4f6]";

  return (
    <div
      className={cn(
        "h-[88px] w-[2px]", // Fixed dimensions from design
        bgColor,
        className
      )}
      {...props}
    />
  );
}
