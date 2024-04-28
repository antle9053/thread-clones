import { StoreApi } from "zustand";
import { FooSlice } from "@/src/modules/foo/zustand/fooSlice";
import { ThemeSlice } from "./slices/themeSlice";
import { AuthSlice } from "./slices/authSlice";
import { ThreadsSlice } from "@/src/modules/threads/zustand/threadsSlice";
import { ThreadActionSlice } from "@/src/modules/home/zustand/threadActionSlice";

export type AppState = {
  foo: FooSlice;
  theme: ThemeSlice;
  //auth: AuthSlice;
} & AuthSlice &
  ThreadsSlice &
  ThreadActionSlice;

export type setAppState = StoreApi<AppState>["setState"];
export type getAppState = StoreApi<AppState>["getState"];
