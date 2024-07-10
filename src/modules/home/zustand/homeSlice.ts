import { ThreadResponseDTO } from "@/src/shared/dto/threads/ThreadResponse.dto";
import { useAppStore } from "@/src/shared/infra/zustand";
import {
  AppState,
  getAppState,
  setAppState,
} from "@/src/shared/infra/zustand/types";
import { StateCreator, StoreApi } from "zustand";

export interface HomeSlice {
  threads: ThreadResponseDTO[];
  page: number;

  setThreads: (_thread: ThreadResponseDTO[]) => void;
  setPage: (_page: number) => void;
}

export const createHomeSlice: StateCreator<HomeSlice> = (
  set: setAppState,
  get: StoreApi<HomeSlice>["getState"]
) => ({
  threads: [],
  page: 0,

  setThreads: (_threads: ThreadResponseDTO[]) => {
    const currentThreads = get().threads;
    set((state: AppState) => ({
      ...state,
      threads: [...currentThreads, ..._threads],
    }));
  },
  setPage: (_page: number) => {
    set((state: AppState) => ({ ...state, page: _page }));
  },
});

export const homeSelectors = {
  threads: (state: AppState) => state.threads,
  page: (state: AppState) => state.page,

  setThreads: (state: AppState) => state.setThreads,
  setPage: (state: AppState) => state.setPage,
};
