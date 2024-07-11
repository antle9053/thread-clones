import { useCallback } from "react";
import { message } from "antd";
import { useAppStore } from "../infra/zustand";
import { authSelectors } from "../infra/zustand/slices/authSlice";
import { pinThreadService } from "../services/thread.service";

export const useHandlePin = () => {
  const user = useAppStore(authSelectors.user);

  const handlePin = useCallback(
    async (threadId: string) => {
      if (threadId && user) {
        message.open({
          key: "message-pinned",
          type: "loading",
          content: "Pinned to top",
          duration: 0,
        });
        await pinThreadService({
          userId: user.id,
          threadId,
          pinned: true,
        });
        message.destroy("message-pinned");
        await message.success("Pinned");
      }
    },
    [user]
  );

  const handleUnpin = useCallback(
    async (threadId: string) => {
      if (threadId && user) {
        message.open({
          key: "message-pinned",
          type: "loading",
          content: "Unpinned",
          duration: 0,
        });
        await pinThreadService({
          userId: user.id,
          threadId,
          pinned: false,
        });
        message.destroy("message-pinned");
        await message.success("Unpinned");
      }
    },
    [user]
  );

  return {
    handlePin,
    handleUnpin,
  };
};
