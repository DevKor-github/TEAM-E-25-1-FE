import { useState, useEffect } from "react";
import { FilterState } from "@/components/FilterSheet";

export function useFilterPersistence(storageKeyPrefix: string) {
  // Selected Segment Persistence
  const [selectedSegment, setSelectedSegment] = useState(() => {
    const saved = sessionStorage.getItem(`${storageKeyPrefix}SelectedSegment`);
    return saved || "많이 본";
  });

  useEffect(() => {
    sessionStorage.setItem(`${storageKeyPrefix}SelectedSegment`, selectedSegment);
  }, [selectedSegment, storageKeyPrefix]);

  // Filter State Persistence
  const [filterState, setFilterState] = useState<FilterState>(() => {
    const saved = sessionStorage.getItem(`${storageKeyPrefix}FilterState`);
    return saved
      ? JSON.parse(saved)
      : {
          types: [],
          includePast: false, // Default to excluding past events
          hasExplicitDateFilter: false,
        };
  });

  useEffect(() => {
    sessionStorage.setItem(
      `${storageKeyPrefix}FilterState`,
      JSON.stringify(filterState)
    );
  }, [filterState, storageKeyPrefix]);

  return {
    selectedSegment,
    setSelectedSegment,
    filterState,
    setFilterState,
  };
}
