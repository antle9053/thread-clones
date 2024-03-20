import { create } from "zustand";

import { AppState, getAppState, setAppState } from "./types";
import { creatFooSlice } from "@/src/modules/foo/zustand/fooSlice";

export const useAppStore = create<AppState>(
  (set: setAppState, get: getAppState) => ({
    foo: {
      ...creatFooSlice(set, get),
    },
  })
);
