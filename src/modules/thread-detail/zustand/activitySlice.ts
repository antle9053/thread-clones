import { AppState, setAppState } from "@/src/shared/infra/zustand/types";
import { GetThreadResponse } from "@/src/shared/services/thread.service";
import { StateCreator } from "zustand";

export interface ActivitySlice {
  isOpenActivity: boolean;
  activityThread?: GetThreadResponse | null;

  setOpenActivity: (_isOpen: boolean) => void;
  setActivityThread: (_thread: GetThreadResponse | null) => void;
}

export const createActivitySlice: StateCreator<ActivitySlice> = (
  set: setAppState
) => ({
  isOpenActivity: false,
  activityThread: null,

  setOpenActivity: (_isOpen: boolean) =>
    set((state: AppState) => ({ ...state, isOpenActivity: _isOpen })),
  setActivityThread: (_thread: GetThreadResponse | null) => {
    set((state: AppState) => ({ ...state, activityThread: _thread }));
  },
});

export const activitySelectors = {
  isOpenActivity: (state: AppState) => state.isOpenActivity,
  activityThread: (state: AppState) => state.activityThread,

  setOpenActivity: (state: AppState) => state.setOpenActivity,
  setActivityThread: (state: AppState) => state.setActivityThread,
};
