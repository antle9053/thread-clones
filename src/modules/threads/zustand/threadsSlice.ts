import { AppState, setAppState } from "@/src/shared/infra/zustand/types";
import { GetThreadResponse } from "@/src/shared/services/thread.service";
import { StateCreator } from "zustand";

export interface ThreadsSlice {
  isOpenCreateThread: boolean;
  replyTo?: string;
  quote?: GetThreadResponse;
  mention?: string;

  setOpenCreateThread: (_isOpen: boolean) => void;
  setReplyTo: (_replyTo: string) => void;
  setQuote: (_quote: GetThreadResponse | undefined) => void;
  setMention: (_mention: string | undefined) => void;
}

export const createThreadsSlice: StateCreator<ThreadsSlice> = (
  set: setAppState
) => ({
  isOpenCreateThread: false,
  replyTo: undefined,
  quote: undefined,
  mention: undefined,

  setOpenCreateThread: (_isOpen: boolean) =>
    set((state: AppState) => ({ ...state, isOpenCreateThread: _isOpen })),
  setReplyTo: (_replyTo: string) => {
    set((state: AppState) => ({ ...state, replyTo: _replyTo }));
  },
  setQuote: (_quote: GetThreadResponse | undefined) => {
    set((state: AppState) => ({ ...state, quote: _quote }));
  },
  setMention: (_user: string | undefined) => {
    set((state: AppState) => ({ ...state, mention: _user }));
  },
});

export const threadsSelectors = {
  isOpenCreateThread: (state: AppState) => state.isOpenCreateThread,
  replyTo: (state: AppState) => state.replyTo,
  quote: (state: AppState) => state.quote,
  mention: (state: AppState) => state.mention,

  setOpenCreateThread: (state: AppState) => state.setOpenCreateThread,
  setReplyTo: (state: AppState) => state.setReplyTo,
  setQuote: (state: AppState) => state.setQuote,
  setMention: (state: AppState) => state.setMention,
};
