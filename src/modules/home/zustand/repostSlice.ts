import { ThreadResponseDTO } from "@/src/shared/dto/threads/ThreadResponse.dto";
import { AppState, setAppState } from "@/src/shared/infra/zustand/types";
import { StateCreator } from "zustand";

export interface RepostSlice {
  isOpenRepost: boolean;
  thread?: ThreadResponseDTO;

  setOpenRepost: (_isOpen: boolean) => void;
  setThread: (_thread: ThreadResponseDTO) => void;
}

export const createRepostSlice: StateCreator<RepostSlice> = (
  set: setAppState
) => ({
  isOpenRepost: false,
  thread: undefined,

  setOpenRepost: (_isOpen: boolean) =>
    set((state: AppState) => ({ ...state, isOpenRepost: _isOpen })),
  setThread: (_thread: ThreadResponseDTO) => {
    set((state: AppState) => ({ ...state, thread: _thread }));
  },
});

export const repostSelectors = {
  isOpenRepost: (state: AppState) => state.isOpenRepost,
  thread: (state: AppState) => state.thread,

  setOpenRepost: (state: AppState) => state.setOpenRepost,
  setThread: (state: AppState) => state.setThread,
};
