import {
  AppState,
  getAppState,
  setAppState,
} from "@/src/shared/infra/zustand/types";

export interface FooSlice {
  text: string;
  changeText: (_text: string) => void;
}

export const creatFooSlice = (set: setAppState, get: getAppState) => ({
  text: "",
  changeText: (_text: string) =>
    set((state: AppState) => ({ foo: { ...state.foo, text: _text } })),
});

export const fooSelectors = {
  fooText: (state: AppState) => state.foo.text,
  changeFooText: (state: AppState) => state.foo.changeText,
};
