import { ThreadResponseDTO } from "@/src/shared/dto/threads/ThreadResponse.dto";
import { AppState, setAppState } from "@/src/shared/infra/zustand/types";
import { StateCreator, StoreApi } from "zustand";
import { pageType } from "..";

export interface HomeSlice {
  threads: { [type: string]: ThreadResponseDTO[] };
  page: number;

  setThreads: (_thread: ThreadResponseDTO[], type: pageType) => void;
  setPage: (_page: number) => void;
  pinThread: (_threadId: string) => void;
  unpinThread: () => void;
}

export const createHomeSlice: StateCreator<HomeSlice> = (
  set: setAppState,
  get: StoreApi<HomeSlice>["getState"]
) => ({
  threads: {},
  page: 0,

  setThreads: (_threads: ThreadResponseDTO[], _type: pageType) => {
    const currentThreads = get().threads;
    const currentThreadsByType = currentThreads[_type] ?? [];
    set((state: AppState) => ({
      ...state,
      threads: {
        ...currentThreads,
        [_type]: [...currentThreadsByType, ..._threads],
      },
    }));
  },
  setPage: (_page: number) => {
    set((state: AppState) => ({ ...state, page: _page }));
  },
  pinThread: (_threadId: string) => {
    const currentThreads = get().threads;
    const profileThreads = currentThreads["profile"];
    const pinnedThread = profileThreads.find(
      (thread) => thread.id === _threadId
    );

    if (pinnedThread) {
      set((state: AppState) => ({
        ...state,
        threads: {
          ...currentThreads,
          profile: [
            {
              ...pinnedThread,
              pinned: true,
            },
            ...profileThreads
              .map((thread) => ({ ...thread, pinned: false }))
              .filter((thread) => thread.id !== pinnedThread.id),
          ],
        },
      }));
    }
  },
  unpinThread: () => {
    const currentThreads = get().threads;
    const profileThreads = currentThreads["profile"];

    set((state: AppState) => ({
      ...state,
      threads: {
        ...currentThreads,
        profile: [
          ...profileThreads.map((thread) => ({ ...thread, pinned: false })),
        ],
      },
    }));
  },
});

export const homeSelectors = {
  threads: (state: AppState) => state.threads,
  page: (state: AppState) => state.page,

  setThreads: (state: AppState) => state.setThreads,
  setPage: (state: AppState) => state.setPage,
  pinThread: (state: AppState) => state.pinThread,
  unpinThread: (state: AppState) => state.unpinThread,
};
