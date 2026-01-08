// src/components/ui/CalendarItem.tsx
import React from 'react';
import CalendarEvent from './CalendarEvent';
import { cn } from '@/lib/utils';

export type CalendarItemEventCount = 'None' | '1' | '2' | '3' | '4+';
export type CalendarItemState = 'Enabled' | 'Activated' | 'Deactivated';

interface CalendarItemProps extends React.HTMLAttributes<HTMLDivElement> {
  date?: string;
  events?: CalendarItemEventCount;
  state?: CalendarItemState;
}

export default function CalendarItem({
  date = '17',
  events = 'None',
  state = 'Enabled',
  className,
  ...props
}: CalendarItemProps) {
  const isDeactivated = state === 'Deactivated';
  const isActivated = state === 'Activated';
  const hasEvents = events !== 'None';
  
  // Background styles based on state and events
  const containerStyle = (() => {
    if (isDeactivated) return "bg-[#f3f4f6]"; // Gray background for deactivated items with/without events? Design shows #f3f4f6 for deactivated
    if (isActivated) return "bg-white border border-[rgba(3,7,18,0.05)] border-solid rounded-[9px] shadow-[0px_4px_20px_0px_rgba(3,7,18,0.1)]";
    return "bg-white rounded-[9px]";
  })();

  const dateTextStyle = (() => {
    if (isDeactivated) return "text-[#99a1af]";
    if (isActivated) return "text-[#6a7282]"; // Active state text color
    return "text-[#6a7282]"; // Default enabled text color
  })();
  
  // Height logic mimicking the design's flex behavior
  const eventsContainerHeight = hasEvents ? "h-[56px]" : "h-[56px]"; // Seems fixed height in design logic

  return (
    <div
      className={cn(
        "flex w-[80px] flex-col items-center justify-center gap-[4px] p-[2px] relative",
        containerStyle,
        className
      )}
      {...props}
    >
      <p className={cn("text-[17px] leading-[24px] text-center w-full whitespace-pre-wrap font-pretendard font-normal", dateTextStyle)}>
        {date}
      </p>

      <div className={cn("flex w-full shrink-0 flex-col items-center relative", eventsContainerHeight, hasEvents ? "gap-[4px]" : "justify-center")}>
         {events === 'None' && (
           // Placeholder or empty space logic if needed, but flex column will just show empty if no children
           // Design: just empty space
           <></>
         )}
         {/* Render events based on count */}
         {events === '1' && (
             <CalendarEvent 
                className={cn("w-full", isDeactivated ? "bg-[#eff6ff]" : "bg-[#eff6ff]")} 
                state={isDeactivated ? "Deactivated" : "Enabled"}
                eventType="강연" 
            />
         )}
         
         {events === '2' && (
            <>
              <CalendarEvent className="w-full h-[16px]" state={isDeactivated ? "Deactivated" : "Enabled"} eventType="강연" />
              <CalendarEvent className="w-full h-[16px]" state={isDeactivated ? "Deactivated" : "Enabled"} eventType="강연" />
            </>
         )}

         {events === '3' && (
            <>
              <CalendarEvent className="w-full h-[16px]" state={isDeactivated ? "Deactivated" : "Enabled"} eventType="강연" />
              <CalendarEvent className="w-full h-[16px]" state={isDeactivated ? "Deactivated" : "Enabled"} eventType="강연" />
              <CalendarEvent className="w-full h-[16px]" state={isDeactivated ? "Deactivated" : "Enabled"} eventType="강연" />
            </>
         )}

         {events === '4+' && (
            <>
              <CalendarEvent className="w-full h-[16px]" state={isDeactivated ? "Deactivated" : "Enabled"} eventType="강연" />
              <CalendarEvent className="w-full h-[16px]" state={isDeactivated ? "Deactivated" : "Enabled"} eventType="강연" />
              <CalendarEvent className="w-full h-[16px]" state={isDeactivated ? "Deactivated" : "Enabled"} eventType="...더보기" />
            </>
         )}
      </div>
    </div>
  );
}
