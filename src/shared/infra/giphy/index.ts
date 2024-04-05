"use server";
import { GiphyFetch } from "@giphy/js-fetch-api";

// use @giphy/js-fetch-api to fetch gifs, instantiate with your api key
const gf = new GiphyFetch(process.env.GIPHY_KEY as string);

// configure your fetch: fetch 10 gifs at a time as the user scrolls (offset is handled by the grid)

// Render the React Component and pass it your fetchGifs as a prop

export const fetchGifs = async (offset: number) => {
  "use server";
  return gf.trending({ offset, limit: 10 });
};

export const searchGifs = async (offset: number, keyword: string) => {
  "use server";
  return gf.search(keyword, { offset });
};

export const fetchGif = async (id: string) => {
  "use server";
  const { data } = await gf.gif(id);
  return data;
};
