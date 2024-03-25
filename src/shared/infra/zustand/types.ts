import { StoreApi } from "zustand";
import { FooSlice } from "@/src/modules/foo/zustand/fooSlice";
import { ThemeSlice } from "./slices/themeSlice";

export interface AppState {
  foo: FooSlice;
  theme: ThemeSlice;
}

export type setAppState = StoreApi<AppState>["setState"];
export type getAppState = StoreApi<AppState>["getState"];
