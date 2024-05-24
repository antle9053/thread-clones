import { StoreApi } from "zustand";
import { ThemeSlice } from "./slices/themeSlice";
import { AuthSlice } from "./slices/authSlice";
import { ThreadsSlice } from "@/src/modules/threads/zustand/threadsSlice";
import { ThreadActionSlice } from "@/src/modules/home/zustand/threadActionSlice";
import { RepostSlice } from "@/src/modules/home/zustand/repostSlice";
import { FollowSlice } from "@/src/modules/profile/zustand/followSlice";

export type AppState = ThemeSlice &
  AuthSlice &
  ThreadsSlice &
  ThreadActionSlice &
  RepostSlice &
  FollowSlice;

export type setAppState = StoreApi<AppState>["setState"];
export type getAppState = StoreApi<AppState>["getState"];
