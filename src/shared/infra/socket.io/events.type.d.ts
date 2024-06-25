import { User } from "../zustand/slices/authSlice";

export type Likes = {
  threadId: string;
  liker: User;
};

export type Unlikes = {
  threadId: string;
  likerId: string;
};

export type Follows = {
  follower: User;
  followedId: string;
};

export type Unfollows = {
  followerId: string;
  followedId: string;
};

export type Mentions = {
  mentioner: User;
  mentionedUsernames: string[];
  threadId: string;
};

export type UnMentions = {
  mentionerId: string;
  mentionedUsernames: string[];
  threadId: string;
};

export type Reposts = {
  reposter: User;
  repostedId: string;
  content: string;
};
