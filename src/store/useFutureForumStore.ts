import { create } from "zustand";

export interface Post {
  id?: string; // Supabase auto-generates uuid
  title: string;
  author: string;
  content: string;
  timestamp: string;
  display: boolean;
}

interface FutureForumStore {
  posts: Post[];
  setPosts: (post: Post[]) => void;
}

export const useFutureForumStore = create<FutureForumStore>((set) => ({
  posts: [],
  setPosts: (posts) => set({posts}),
}));
