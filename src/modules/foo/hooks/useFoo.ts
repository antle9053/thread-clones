import { useAppStore } from "@/src/shared/infra/zustand";
import { useState } from "react";
import { fooSelectors } from "../zustand/fooSlice";
import { createUser } from "../services/fooServices";

export const useFoo = () => {
  const [text, setText] = useState<string>("");

  const fooTextValue = useAppStore(fooSelectors.fooText);
  const handleChangeFooText = useAppStore(fooSelectors.changeFooText);

  const handleCreateUser = async () => {
    createUser(text);
  };

  return {
    text,
    setText,
    fooTextValue,
    handleChangeFooText,
    handleCreateUser,
  };
};
