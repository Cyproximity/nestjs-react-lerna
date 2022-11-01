import zustand from "zustand";

interface bookmarkItemState {
  title: string;
  description?: string;
  link: string;
}

interface bookmarkState {
  bookmarks: bookmarkItemState[];
  setBookmarks: (bookmark: bookmarkItemState[]) => void;
}

export const userStore = zustand<bookmarkState>()((set) => ({
  bookmarks: [],
  setBookmarks: (bookmark) => set({ bookmarks: [...bookmark] }),
}));
