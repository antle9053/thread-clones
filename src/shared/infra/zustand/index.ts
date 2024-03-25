import { create } from "zustand";

import { AppState, getAppState, setAppState } from "./types";
import { creatFooSlice } from "@/src/modules/foo/zustand/fooSlice";

import { createThemeSlice } from "./slices/themeSlice";

export const useAppStore = create<AppState>(
  (set: setAppState, get: getAppState) => ({
    foo: {
      ...creatFooSlice(set, get),
    },
    theme: {
      ...createThemeSlice(set, get),
    },
  })
);
