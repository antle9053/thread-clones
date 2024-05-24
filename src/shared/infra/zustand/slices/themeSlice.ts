import { StateCreator } from "zustand";
import { AppState, getAppState, setAppState } from "../types";

export const arrColors = [
  "9b5de5",
  "f15bb5",
  "fee440",
  "00f5d4",
  "00bbf9",
] as const;
export type themeColor = (typeof arrColors)[number];

export interface ThemeSlice {
  color: themeColor;
  changeColor: (_color: themeColor) => void;
}

export const createThemeSlice: StateCreator<ThemeSlice> = (
  set: setAppState
) => ({
  color: "00bbf9" as themeColor,
  changeColor: (_color: themeColor) =>
    set((state: AppState) => ({ ...state, color: _color })),
});

export const themeSelectors = {
  color: (state: AppState) => state.color,
  changeColor: (state: AppState) => state.changeColor,
};
