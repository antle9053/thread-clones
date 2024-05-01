import {
  GetUserResponse,
  getUserService,
} from "@/src/shared/services/user.service";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppStore } from "@/src/shared/infra/zustand";
import { authSelectors } from "@/src/shared/infra/zustand/slices/authSlice";

interface UseProfileProps {
  username: string;
}

export const useProfile = ({ username }: UseProfileProps) => {
  const [profile, setProfile] = useState<GetUserResponse | null>(null);
  const [isSelf, setIsSelf] = useState<boolean | null>(false);
  const user = useAppStore(authSelectors.user);

  const fetchUser = useCallback(
    async (username: string) => {
      const res = await getUserService(undefined, username);
      setProfile(res);
    },
    [username]
  );

  useEffect(() => {
    if (user?.username === username) {
      setIsSelf(true);
      setProfile(user);
    } else {
      setIsSelf(false);
      fetchUser(username);
    }
  }, [username, user]);

  const refetch = () => fetchUser(username);

  return {
    isSelf,
    profile,
    refetch,
  };
};
