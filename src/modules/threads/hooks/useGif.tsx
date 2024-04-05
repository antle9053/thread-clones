import { useState } from "react";

export const useGif = () => {
  const [isOpenGif, setOpenGif] = useState<boolean>(false);
  const [openGifAt, setOpenGifAt] = useState<number>(-1);
  const [gifs, setGifs] = useState<any[]>([]);

  return {
    isOpenGif,
    gifs,
    openGifAt,
    setGifs,
    setOpenGif,
    setOpenGifAt,
  };
};
