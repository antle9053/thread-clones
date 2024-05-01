"use client";

import { FC } from "react";
import { Loading } from "@/src/shared/components/ui/Loading";
import { useGetThreads } from "./hooks/useGetThreads";
import { Thread } from "./components/Thread";

export type pageType = "home" | "liked" | "saved" | "profile";

interface HomeProps {
  pageType?: pageType;
  profileId?: string;
}

export const Home: FC<HomeProps> = ({ pageType = "home", profileId }) => {
  const { loading, threads } = useGetThreads({
    pageType,
    profileId,
  });

  if (loading) {
    return <Loading fullPage />;
  }

  return (
    <div className="mx-auto w-[600px] max-w-full min-h-full pb-[48px]">
      {threads.map((thread, index) => {
        return <Thread key={index} data={thread} />;
      })}
    </div>
  );
};
