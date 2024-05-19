import {
  AppState,
  getAppState,
  setAppState,
} from "@/src/shared/infra/zustand/types";
import { User } from "@/src/shared/services/follows.service";
import { GetThreadResponse } from "@/src/shared/services/thread.service";
import { Prisma } from "@prisma/client";
import { StateCreator } from "zustand";

export type UserWithFollow = User & {
  isFollowed: boolean;
};

export interface FollowSlice {
  isOpenFollow: boolean;
  profile?: User;
  listFollowings: UserWithFollow[];
  listFolloweds: UserWithFollow[];

  setOpenFollow: (_isOpen: boolean) => void;
  setProfile: (_profile: any) => void;
  setListFollowings: (list: UserWithFollow[]) => void;
  setListFolloweds: (list: UserWithFollow[]) => void;
  updateFollow: (id: string, isFollowed: boolean) => void;
}

export const createFollowSlice: StateCreator<FollowSlice> = (
  set: setAppState
) => ({
  isOpenFollow: false,
  profile: undefined,
  listFollowings: [],
  listFolloweds: [],

  setOpenFollow: (_isOpen: boolean) =>
    set((state: AppState) => ({ ...state, isOpenFollow: _isOpen })),
  setProfile: (_profile: any) => {
    set((state: AppState) => ({ ...state, profile: _profile }));
  },
  setListFollowings: (list: UserWithFollow[]) => {
    set((state: AppState) => ({ ...state, listFollowings: list }));
  },
  setListFolloweds: (list: UserWithFollow[]) => {
    set((state: AppState) => ({ ...state, listFolloweds: list }));
  },
  updateFollow: (id: string, isFollowed: boolean) => {
    set((state: AppState) => {
      const { listFolloweds, listFollowings } = state;
      return {
        ...state,
        listFolloweds: listFolloweds.map((followed) =>
          followed.id === id ? { ...followed, isFollowed } : followed
        ),
        listFollowings: listFollowings.map((following) =>
          following.id === id ? { ...following, isFollowed } : following
        ),
      };
    });
  },
});

export const followSelectors = {
  isOpenFollow: (state: AppState) => state.isOpenFollow,
  profile: (state: AppState) => state.profile,
  listFollowings: (state: AppState) => state.listFollowings,
  listFolloweds: (state: AppState) => state.listFolloweds,

  setOpenFollow: (state: AppState) => state.setOpenFollow,
  setProfile: (state: AppState) => state.setProfile,
  setListFollowings: (state: AppState) => state.setListFollowings,
  setListFolloweds: (state: AppState) => state.setListFolloweds,
  updateFollow: (state: AppState) => state.updateFollow,
};
