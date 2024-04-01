import { AppState, setAppState } from "@/src/shared/infra/zustand/types";
import { StateCreator } from "zustand";

export interface ThreadsSlice {
  isOpenCreateThread: boolean;

  setOpenCreateThread: (_isOpen: boolean) => void;
}

export const createThreadsSlice: StateCreator<ThreadsSlice> = (
  set: setAppState
) => ({
  isOpenCreateThread: false,

  setOpenCreateThread: (_isOpen: boolean) =>
    set((state: AppState) => ({ ...state, isOpenCreateThread: _isOpen })),
});

export const threadsSelectors = {
  isOpenCreateThread: (state: AppState) => state.isOpenCreateThread,

  setOpenCreateThread: (state: AppState) => state.setOpenCreateThread,
};
