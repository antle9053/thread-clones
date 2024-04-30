import { StateCreator } from "zustand";
import { AppState, setAppState } from "../types";
import { GetUserResponse } from "@/src/shared/services/user.service";

export type User = GetUserResponse;

export interface AuthSlice {
  user: User | null;
  setUser: (_user: User | null) => void;
  logOut: () => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set: setAppState) => ({
  user: null,
  setUser: (_user: User | null) => {
    set((state: AppState) => ({
      ...state,
      user: _user,
    }));
  },
  logOut: () => {
    set((state: AppState) => ({
      ...state,
      user: null,
    }));
  },
});

export const authSelectors = {
  user: (state: AppState) => state.user,
  setUser: (state: AppState) => state.setUser,
  logOut: (state: AppState) => state.logOut,
};
