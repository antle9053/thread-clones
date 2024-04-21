import { useState } from "react";

export const usePool = () => {
  const [polls, setPolls] = useState<any[][]>([[]]);

  const removeAllPolls = () => setPolls([[]]);
  return {
    polls,
    setPolls,
    removeAllPolls,
  };
};
