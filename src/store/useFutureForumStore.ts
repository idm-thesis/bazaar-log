import { create } from "zustand";

export interface LanPost {
  id: number;
  title: string;
  author: string;
  content: string;
  timestamp: string;
}

interface LanForumStore {
  posts: LanPost[];
  addLanPost: (post: LanPost) => void;
}

export const useFutureForumStore = create<LanForumStore>((set) => ({
  posts: [],
  addLanPost: (post) =>
    set((state) => ({
      posts: [...state.posts, post],
    })),
}));
