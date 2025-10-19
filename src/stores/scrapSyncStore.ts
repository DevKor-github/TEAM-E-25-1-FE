import { create } from "zustand";

export type ScrapStatus = {
  articleId: string;
  isScrapped: boolean;
  scrapCount?: number;
};

type ScrapSyncState = {
  updates: Record<string, ScrapStatus>;
  setScrapStatus: (status: ScrapStatus) => void;
  clearScrapStatus: (articleId: string) => void;
};

export const useScrapSyncStore = create<ScrapSyncState>((set) => ({
  updates: {},
  setScrapStatus: (status) =>
    set((state) => ({
      updates: { ...state.updates, [status.articleId]: status },
    })),
  clearScrapStatus: (articleId) =>
    set((state) => {
      if (!(articleId in state.updates)) {
        return state;
      }
      const nextUpdates = { ...state.updates };
      delete nextUpdates[articleId];
      return { updates: nextUpdates };
    }),
}));
