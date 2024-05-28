import { activitySelectors } from "@/src/modules/thread-detail/zustand/activitySlice";
import { useAppStore } from "../infra/zustand";
import { authSelectors } from "../infra/zustand/slices/authSlice";

export const useActivity = () => {
  const isOpen = useAppStore(activitySelectors.isOpenActivity);
  const setOpen = useAppStore(activitySelectors.setOpenActivity);
  const thread = useAppStore(activitySelectors.setActivityThread);

  const user = useAppStore(authSelectors.user);

  const handleClose = () => {
    setOpen(false);
  };

  return { handleClose, isOpen };
};
