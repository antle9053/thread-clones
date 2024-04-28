import { AppState, setAppState } from "@/src/shared/infra/zustand/types";
import { StateCreator } from "zustand";

export interface ThreadActionSlice {
  isOpenThreadAction: boolean;
  threadId?: string;

  setOpenThreadAction: (_isOpen: boolean) => void;
  setThreadId: (_threadId: string) => void;
}

export const createThreadActionSlice: StateCreator<ThreadActionSlice> = (
  set: setAppState
) => ({
  isOpenThreadAction: false,
  threadId: undefined,

  setOpenThreadAction: (_isOpen: boolean) =>
    set((state: AppState) => ({ ...state, isOpenThreadAction: _isOpen })),
  setThreadId: (_threadId: string) => {
    set((state: AppState) => ({ ...state, threadId: _threadId }));
  },
});

export const threadActionSelectors = {
  isOpenThreadAction: (state: AppState) => state.isOpenThreadAction,
  threadId: (state: AppState) => state.threadId,

  setOpenThreadAction: (state: AppState) => state.setOpenThreadAction,
  setThreadId: (state: AppState) => state.setThreadId,
};
