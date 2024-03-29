import { StoreApi } from "zustand";
import { FooSlice } from "@/src/modules/foo/zustand/fooSlice";
import { ThemeSlice } from "./slices/themeSlice";
import { AuthSlice } from "./slices/authSlice";

export type AppState = {
  foo: FooSlice;
  theme: ThemeSlice;
  //auth: AuthSlice;
} & AuthSlice;

export type setAppState = StoreApi<AppState>["setState"];
export type getAppState = StoreApi<AppState>["getState"];
