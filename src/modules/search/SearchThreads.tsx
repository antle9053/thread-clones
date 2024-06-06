import { FC, useEffect, useState } from "react";
import { Thread } from "../home/components/Thread";
import {
  GetThreadResponse,
  searchThreads,
} from "@/src/shared/services/thread.service";

interface SearchThreadsProps {
  query: string;
}

export const SearchThreads: FC<SearchThreadsProps> = ({ query }) => {
  const [threads, setThreads] = useState<GetThreadResponse[]>([]);

  useEffect(() => {
    const fetchThreads = async () => {
      const threads = await searchThreads(query);
      console.log(threads);
      setThreads(threads);
    };
    fetchThreads();
  }, [query]);

  return (
    <div className="mx-auto w-[600px] max-w-full min-h-full pb-[48px]">
      {(threads ?? []).map((thread, index) => {
        return <Thread key={index} data={thread} />;
      })}
    </div>
  );
};
