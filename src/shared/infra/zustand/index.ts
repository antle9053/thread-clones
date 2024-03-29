import { StoreApi, create } from "zustand";

import { AppState, getAppState, setAppState } from "./types";
import { creatFooSlice } from "@/src/modules/foo/zustand/fooSlice";

import { createThemeSlice } from "./slices/themeSlice";
import { createAuthSlice } from "./slices/authSlice";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAppStore = create<AppState>()(
  (set: setAppState, get: getAppState, api: StoreApi<AppState>) => ({
    foo: {
      ...creatFooSlice(set, get),
    },
    theme: {
      ...createThemeSlice(set, get),
    },

    ...persist(createAuthSlice, {
      name: "auth",
      partialize: (state) => ({ user: state.user }),
      storage: createJSONStorage(() => localStorage),
    })(set, get, api),
  })
);
