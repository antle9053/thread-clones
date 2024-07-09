import { createActivitySlice } from "./../../../modules/thread-detail/zustand/activitySlice";
import { createFollowSlice } from "./../../../modules/profile/zustand/followSlice";
import { createRepostSlice } from "./../../../modules/home/zustand/repostSlice";
import { createThreadActionSlice } from "./../../../modules/home/zustand/threadActionSlice";
import { StoreApi, create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { AppState, getAppState, setAppState } from "./types";

import { createThemeSlice } from "./slices/themeSlice";
import { createAuthSlice } from "./slices/authSlice";
import { createThreadsSlice } from "@/src/modules/threads/zustand/threadsSlice";
import { createNotificationSlice } from "./slices/notificationSlice";

export const useAppStore = create<AppState>()(
  (set: setAppState, get: getAppState, api: StoreApi<AppState>) => ({
    ...persist(createAuthSlice, {
      name: "auth",
      partialize: (state) => ({ user: state.user }),
      storage: createJSONStorage(() => localStorage),
    })(set, get, api),
    ...createThemeSlice(set, get, api),
    ...createThreadsSlice(set, get, api),
    ...createThreadActionSlice(set, get, api),
    ...createRepostSlice(set, get, api),
    ...createFollowSlice(set, get, api),
    ...createActivitySlice(set, get, api),
    ...createNotificationSlice(set, get, api),
  })
);
