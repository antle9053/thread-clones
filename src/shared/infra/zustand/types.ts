import { StoreApi } from "zustand";
import { FooSlice } from "@/src/modules/foo/zustand/fooSlice";

export interface AppState {
  foo: FooSlice;
}

export type setAppState = StoreApi<AppState>["setState"];
export type getAppState = StoreApi<AppState>["getState"];
