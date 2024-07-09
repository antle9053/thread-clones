import { SendNotiResponseDTO } from "./../../../dto/notifications/SendNotiResponse.dto";
import { StateCreator, StoreApi } from "zustand";
import { AppState, setAppState, getAppState } from "../types";
import { GetUserResponse } from "@/src/shared/services/user.service";

export type User = GetUserResponse;

export type SendNotiResponseWithFollow = SendNotiResponseDTO & {
  notification: {
    sender: {
      isFollowed: boolean;
    };
  };
  notiId?: string;
};

export interface NotificationSlice {
  sends: SendNotiResponseWithFollow[];
  unreadCount: () => number;

  setSends: (_sends: SendNotiResponseWithFollow[]) => void;
  updateReadStatus: (sendId: string) => void;
}

export const createNotificationSlice: StateCreator<NotificationSlice> = (
  set: setAppState,
  get: StoreApi<NotificationSlice>["getState"]
) => ({
  sends: [],
  unreadCount: () => {
    return get().sends.filter((send) => send.read === false).length;
  },
  setSends: (_sends: SendNotiResponseWithFollow[]) => {
    set((state: AppState) => ({
      ...state,
      sends: _sends,
    }));
  },
  updateReadStatus: (sendId: string) => {
    set((state: AppState) => ({
      ...state,
      sends: state.sends.map((send) => {
        const id = send.id;
        return id === sendId ? { ...send, read: true } : send;
      }),
    }));
  },
});

export const notificationSelectors = {
  sends: (state: AppState) => state.sends,
  unreadCount: (state: AppState) => state.unreadCount,
  setSends: (state: AppState) => state.setSends,
  updateReadStatus: (state: AppState) => state.updateReadStatus,
};
