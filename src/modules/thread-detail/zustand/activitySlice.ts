import { AppState, setAppState } from "@/src/shared/infra/zustand/types";
import { GetThreadResponse } from "@/src/shared/services/thread.service";
import { StateCreator } from "zustand";
import { User } from "@/src/shared/services/follows.service";
import { activityType } from "@/src/shared/hooks/useActivity";
import { UserWithFollow } from "../../profile/zustand/followSlice";

export type UserActivity = {
  profile: UserWithFollow;
  timestamp: Date;
  type: activityType;
};

export interface ActivitySlice {
  isOpenActivity: boolean;
  activityThread?: GetThreadResponse | null;
  listActivities: UserActivity[];

  setOpenActivity: (_isOpen: boolean) => void;
  setActivityThread: (_thread: GetThreadResponse | null) => void;
  setListActivities: (list: UserActivity[]) => void;
  updateFollowInActivity: (id: string, isFollowed: boolean) => void;
}

export const createActivitySlice: StateCreator<ActivitySlice> = (
  set: setAppState
) => ({
  isOpenActivity: false,
  activityThread: null,
  listActivities: [],

  setOpenActivity: (_isOpen: boolean) =>
    set((state: AppState) => ({ ...state, isOpenActivity: _isOpen })),
  setActivityThread: (_thread: GetThreadResponse | null) => {
    set((state: AppState) => ({ ...state, activityThread: _thread }));
  },
  setListActivities: (list: UserActivity[]) => {
    set((state: AppState) => ({ ...state, listActivities: list }));
  },
  updateFollowInActivity: (id: string, isFollowed: boolean) => {
    set((state: AppState) => {
      const { listActivities } = state;
      return {
        ...state,
        listActivities: listActivities.map((followed) =>
          followed.profile.id === id
            ? {
                ...followed,
                profile: {
                  ...followed.profile,
                  isFollowed,
                },
              }
            : followed
        ),
      };
    });
  },
});

export const activitySelectors = {
  isOpenActivity: (state: AppState) => state.isOpenActivity,
  activityThread: (state: AppState) => state.activityThread,
  listActivities: (state: AppState) => state.listActivities,

  setOpenActivity: (state: AppState) => state.setOpenActivity,
  setActivityThread: (state: AppState) => state.setActivityThread,
  setListActivities: (state: AppState) => state.setListActivities,
  updateFollowInActivity: (state: AppState) => state.updateFollowInActivity,
};
