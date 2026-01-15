// src/components/ui/CalendarGridRow.tsx
import React from 'react';
import CalendarItem from './CalendarItem';
import CalendarMargin from './CalendarMargin';
import { cn } from '@/lib/utils';

export type DeactivatedItemType = 'Both Enabled' | 'Left Only' | 'Right Only';

interface CalendarGridRowProps extends React.HTMLAttributes<HTMLDivElement> {
  deactivatedItem?: DeactivatedItemType;
}

export default function CalendarGridRow({
  className,
  deactivatedItem = 'Both Enabled', 
  ...props
}: CalendarGridRowProps) {

  return (
    <div
      className={cn(
        "flex w-fit bg-white items-center justify-center", 
        className
      )}
      {...props}
    >
        {/* Left Margin */}
        <CalendarMargin nearbyItemOnMonth={deactivatedItem !== 'Left Only'} />
        
        <CalendarItem date="1" events="None" state={deactivatedItem === 'Left Only' ? 'Deactivated' : 'Enabled'} />
        <CalendarItem date="2" events="1" state={deactivatedItem === 'Left Only' ? 'Deactivated' : 'Enabled'} />
        
        <CalendarItem date="3" events="2" state="Enabled" />
        <CalendarItem date="4" events="3" state="Enabled" />
        <CalendarItem date="5" events="4+" state={deactivatedItem === 'Right Only' ? 'Deactivated' : 'Enabled'} />
        
        <CalendarItem date="6" events="None" state={deactivatedItem === 'Right Only' ? 'Deactivated' : 'Enabled'} />
        <CalendarItem date="7" events="None" state={deactivatedItem === 'Right Only' ? 'Deactivated' : 'Enabled'} />

        {/* Right Margin */}
        <CalendarMargin nearbyItemOnMonth={deactivatedItem !== 'Right Only'} />
    </div>
  );
}
