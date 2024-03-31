import { StateCreator } from "zustand";
import { AppState, setAppState } from "../types";

export interface User {
  userId: string;
  name: string;
  username: string | null;
  avatar: string | null;
  bio: string | null;
  links: string[];
}

export interface AuthSlice {
  user: User | null;
  setUser: (_user: User | null) => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set: setAppState) => ({
  user: null,
  setUser: (_user: User | null) => {
    console.log(_user);
    set((state: AppState) => ({
      ...state,
      user: _user,
    }));
  },
});

export const authSelectors = {
  user: (state: AppState) => state.user,
  setUser: (state: AppState) => state.setUser,
};
