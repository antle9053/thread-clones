import { useAppStore } from "../infra/zustand";
import { useCallback, useEffect, useState } from "react";
import { authSelectors } from "../infra/zustand/slices/authSlice";
import { message } from "antd";
import { followSelectors } from "@/src/modules/profile/zustand/followSlice";
import {
  listFollowedsService,
  listFollowingsService,
} from "../services/follows.service";

export const useFollow = () => {
  const isOpen = useAppStore(followSelectors.isOpenFollow);
  const setOpen = useAppStore(followSelectors.setOpenFollow);
  const profile = useAppStore(followSelectors.profile);
  const setProfile = useAppStore(followSelectors.setProfile);

  const [listFollowings, setListFollowings] = useState<any[]>([]);
  const [listFolloweds, setListFolloweds] = useState<any[]>([]);

  const user = useAppStore(authSelectors.user);

  useEffect(() => {
    const initFollows = async () => {
      if (profile?.id) {
        const listFollowings = await listFollowingsService(profile.id);
        const listFolloweds = await listFollowedsService(profile.id);

        setListFollowings(listFollowings);
        setListFolloweds(listFolloweds);
      }
    };
    initFollows();
  }, [profile]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return {
    isOpen,
    handleClose,
    handleOpen,
    listFolloweds,
    listFollowings,
    profile,
    setProfile,
  };
};
