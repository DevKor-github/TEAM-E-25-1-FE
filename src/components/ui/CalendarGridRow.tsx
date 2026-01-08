// src/components/ui/CalendarGridRow.tsx
import React from 'react';
import CalendarItem from './CalendarItem';
import CalendarMargin from './CalendarMargin';
import { cn } from '@/lib/utils';

export type DeactivatedItemType = 'Both Enabled' | 'Left Only' | 'Right Only';

interface CalendarGridRowProps extends React.HTMLAttributes<HTMLDivElement> {
  deactivatedItem?: DeactivatedItemType;
  // We can pass data for items if needed, but for now sticking to the design structure which uses default dummy data logic
  // Update: To make it reusable, we should probably allow passing data or event counts for the 7 days (or 5 days since there are 5 items + 2 margins in the screenshot structure)
  // The screenshot/design shows:
  // - Margin
  // - Item 1 (state depends on deactivatedItem)
  // - Item 2 (state depends on deactivatedItem)
  // - Item 3 (state depends on deactivatedItem)
  // - Item 4 (state depends on deactivatedItem)
  // - Item 5 (state depends on deactivatedItem)
  // - Margin
  
  // Actually, looking at the code from Figma:
  // It renders: 
  // <div ... bg-white ... w-[564px]>
  //   <div flex row>
  //      Margin (Left) - logic based on deactivatedItem
  //      Margin (Right) - logic based on deactivatedItem
  //   </div>
  //   5 CalendarItems...
  // </div>
  // Wait, the structure in the Figma code seems to put margins in a separate flex row ABOVE the items?
  // No, looking closer at the node structure in Figma code:
  // It has a parent div w-[564px].
  // Inside:
  //  1. A div `flex flex-row items-center self-stretch` containing conditional Margins. This looks like a background spacer or guide?
  //  2. Then 5 CalendarItems rendered conditionally based on `deactivatedItem` state.
  //  3. Then more Margins rendered conditionally at the end?
  
  // Actually, standard Flex row layout usually means items are side-by-side.
  // The Figma code structure is a bit weird with multiple conditional blocks.
  // Let's re-read the screenshot structure.
  // It looks like a row of 7 days (Mon-Sun) or 5 days? The width 564px suggests maybe 1 week or just weekdays?
  // 80px * 7 = 560px. 564px is close. 
  // 5 items * 80px = 400px.
  // The design code renders 5 items.
  // 80 * 5 = 400.
  // Margins are 2px.
  
  // Let's implement a clean flex row that accepts children or data.
  // If we strictly follow the `deactivatedItem` prop logic to control the enabled/disabled state of the row items:
  
  // If "Both Enabled": All items enabled?
  // If "Both Disabled": All items disabled?
  // If "Left Only": Left item disabled? Or Left items disabled?
  // The prop name `state` in the Figma code for items is tied to `deactivatedItem`.
  
  // Figma Code logic for items:
  // if ["Left Only", "Right Only", "Both Disabled"]:
  //    Render 2 Deactivated Items.
  // if ["Left Only", "Right Only", "Both Enabled"]:
  //    Render 5 Enabled Items.
  // This logic seems overlapping and potentially duplicative in the generated code.
  
  // Let's interpret the intent:
  // "Left Only" -> Maybe the first few are disabled?
  // "Right Only" -> Maybe the last few are disabled?
  
  // However, `CalendarGridRow` implies a row in a monthly calendar.
  // Usually, disabled items are from previous/next month.
  
  // Let's simply expose a component that renders a row of `CalendarItem`s and handles the margins.
  // For simplicity and reusing the "Note 1-234" intent: It's a row container.
  
  // Let's create a row that expects 7 days (standard week).
  // The Figma node `1:234` seems to be a specific instance or pattern.
  // Let's build a flexible `CalendarWeekRow` instead of hardcoding "564px".
  // But if the user strictly wants "1-234", I should respect the visual style.
  // The width `w-[564px]` is explicit.
  
  // Let's assume it accepts an array of item props.
}

export default function CalendarGridRow({
  className,
  deactivatedItem = 'Both Enabled', // Keeping the prop name for compatibility with design thought process, though maybe "variant" is better
  ...props
}: CalendarGridRowProps) {
  
  // Logic to determine state of items based on "deactivatedItem" prop from Figma.
  // Figma code:
  // isLeftOnly -> 2 disabled items at start?
  // isRightOnly -> 
  
  // Let's just create a row of 7 items for a standard week, 
  // and control them via a more practical prop interface or children.
  // But to stick to "Implementation based on existing UI":
  
  // I will create a container that lays out CalendarItems and CalendarMargins.
  // Standard Calendar Week: Margin | Item | Item | ... | Item | Margin
  // or Item | Item ...
  
  // The screenshot shows: 5 items + margins.
  // Let's try to replicate the `1:234` component's look.
  // 564px width.
  // Flex container.
  
  return (
    <div
      className={cn(
        "flex w-fit bg-white items-center justify-center", // Auto width or fixed? Design says 564px
        className
      )}
      {...props}
    >
        {/* We can reproduce the specific example from Figma with default items */}
        {/* Left Margin */}
        <CalendarMargin nearbyItemOnMonth={deactivatedItem !== 'Left Only'} />
        
        {/* Items - For demonstration of the component, I'll render a few with different states */}
        {/* In a real app, this would map over data */}
        
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
