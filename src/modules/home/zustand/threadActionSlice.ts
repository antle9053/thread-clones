import { AppState, setAppState } from "@/src/shared/infra/zustand/types";
import { GetThreadResponse } from "@/src/shared/services/thread.service";
import { StateCreator } from "zustand";

export interface ThreadActionSlice {
  isOpenThreadAction: boolean;
  thread?: GetThreadResponse;

  setOpenThreadAction: (_isOpen: boolean) => void;
  setThread: (_thread: GetThreadResponse) => void;
}

export const createThreadActionSlice: StateCreator<ThreadActionSlice> = (
  set: setAppState
) => ({
  isOpenThreadAction: false,
  thread: undefined,

  setOpenThreadAction: (_isOpen: boolean) =>
    set((state: AppState) => ({ ...state, isOpenThreadAction: _isOpen })),
  setThread: (_thread: GetThreadResponse) => {
    set((state: AppState) => ({ ...state, thread: _thread }));
  },
});

export const threadActionSelectors = {
  isOpenThreadAction: (state: AppState) => state.isOpenThreadAction,
  thread: (state: AppState) => state.thread,

  setOpenThreadAction: (state: AppState) => state.setOpenThreadAction,
  setThread: (state: AppState) => state.setThread,
};
