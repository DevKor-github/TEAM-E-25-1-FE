import { create } from "zustand";
import { PageName } from "@/types/pageName";

interface PreviousPageState {
  previousPage: PageName | null;
  setPreviousPage: (path: PageName) => void;
}

export const usePreviousPageStore = create<PreviousPageState>((set) => ({
  previousPage: null,
  setPreviousPage: (path) => set({ previousPage: path }),
}));
