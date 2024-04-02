import { AppState, setAppState } from "@/src/shared/infra/zustand/types";
import { StateCreator } from "zustand";

export interface ThreadsSlice {
  isOpenCreateThread: boolean;
  replyTo?: string;

  setOpenCreateThread: (_isOpen: boolean) => void;
  setReplyTo: (_replyTo: string) => void;
}

export const createThreadsSlice: StateCreator<ThreadsSlice> = (
  set: setAppState
) => ({
  isOpenCreateThread: false,
  replyTo: undefined,

  setOpenCreateThread: (_isOpen: boolean) =>
    set((state: AppState) => ({ ...state, isOpenCreateThread: _isOpen })),
  setReplyTo: (_replyTo: string) => {
    set((state: AppState) => ({ ...state, replyTo: _replyTo }));
  },
});

export const threadsSelectors = {
  isOpenCreateThread: (state: AppState) => state.isOpenCreateThread,
  replyTo: (state: AppState) => state.replyTo,

  setOpenCreateThread: (state: AppState) => state.setOpenCreateThread,
  setReplyTo: (state: AppState) => state.setReplyTo,
};
