import { User } from "../zustand/slices/authSlice";

export type Likes = {
  threadId: string;
  liker: User;
};

export type Unlikes = {
  threadId: string;
  likerId: string;
};
