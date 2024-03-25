import {
  AppState,
  getAppState,
  setAppState,
} from "@/src/shared/infra/zustand/types";

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

export const createThemeSlice = (set: setAppState, get: getAppState) => ({
  color: "00bbf9" as themeColor,
  changeColor: (_color: themeColor) =>
    set((state: AppState) => ({ theme: { ...state.theme, color: _color } })),
});

export const themeSelectors = {
  color: (state: AppState) => state.theme.color,
  changeColor: (state: AppState) => state.theme.changeColor,
};
