import { AppState, setAppState } from "@/src/shared/infra/zustand/types";
import { GetThreadResponse } from "@/src/shared/services/thread.service";
import { Prisma } from "@prisma/client";
import { StateCreator } from "zustand";

export interface FollowSlice {
  isOpenFollow: boolean;
  profile?: any;

  setOpenFollow: (_isOpen: boolean) => void;
  setProfile: (_profile: any) => void;
}

export const createFollowSlice: StateCreator<FollowSlice> = (
  set: setAppState
) => ({
  isOpenFollow: false,
  profile: undefined,

  setOpenFollow: (_isOpen: boolean) =>
    set((state: AppState) => ({ ...state, isOpenFollow: _isOpen })),
  setProfile: (_profile: any) => {
    set((state: AppState) => ({ ...state, profile: _profile }));
  },
});

export const followSelectors = {
  isOpenFollow: (state: AppState) => state.isOpenFollow,
  profile: (state: AppState) => state.profile,

  setOpenFollow: (state: AppState) => state.setOpenFollow,
  setProfile: (state: AppState) => state.setProfile,
};
