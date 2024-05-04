import { AppState, setAppState } from "@/src/shared/infra/zustand/types";
import { GetThreadResponse } from "@/src/shared/services/thread.service";
import { StateCreator } from "zustand";

export interface RepostSlice {
  isOpenRepost: boolean;
  thread?: GetThreadResponse;

  setOpenRepost: (_isOpen: boolean) => void;
  setThread: (_thread: GetThreadResponse) => void;
}

export const createRepostSlice: StateCreator<RepostSlice> = (
  set: setAppState
) => ({
  isOpenRepost: false,
  thread: undefined,

  setOpenRepost: (_isOpen: boolean) =>
    set((state: AppState) => ({ ...state, isOpenRepost: _isOpen })),
  setThread: (_thread: GetThreadResponse) => {
    set((state: AppState) => ({ ...state, thread: _thread }));
  },
});

export const repostSelectors = {
  isOpenRepost: (state: AppState) => state.isOpenRepost,
  thread: (state: AppState) => state.thread,

  setOpenRepost: (state: AppState) => state.setOpenRepost,
  setThread: (state: AppState) => state.setThread,
};
