import { StoreApi } from "zustand";
import { FooSlice } from "@/src/modules/foo/zustand/fooSlice";
import { ThemeSlice } from "./slices/themeSlice";
import { AuthSlice } from "./slices/authSlice";
import { ThreadsSlice } from "@/src/modules/threads/zustand/threadsSlice";

export type AppState = {
  foo: FooSlice;
  theme: ThemeSlice;
  //auth: AuthSlice;
} & AuthSlice &
  ThreadsSlice;

export type setAppState = StoreApi<AppState>["setState"];
export type getAppState = StoreApi<AppState>["getState"];
