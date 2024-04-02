"use client";

import { Loading } from "@/src/shared/components/ui/Loading";
import { useGetThreads } from "./hooks/useGetThreads";
import { Thread } from "./components/Thread";

export const Home = () => {
  const { loading, threads } = useGetThreads();
  if (loading) {
    return <Loading fullPage />;
  }
  console.log(threads);
  return (
    <div className="mx-auto w-[600px] max-w-full min-h-full pb-[48px]">
      {threads.map((thread, index) => {
        return <Thread key={index} data={thread} />;
      })}
    </div>
  );
};
