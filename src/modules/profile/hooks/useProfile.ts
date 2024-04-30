import {
  GetUserResponse,
  getUserService,
} from "@/src/shared/services/user.service";
import { useEffect, useMemo, useState } from "react";
import { useAppStore } from "@/src/shared/infra/zustand";
import { authSelectors } from "@/src/shared/infra/zustand/slices/authSlice";

interface UseProfileProps {
  username: string;
}

export const useProfile = ({ username }: UseProfileProps) => {
  const [profile, setProfile] = useState<GetUserResponse | null>(null);
  const [isSelf, setIsSelf] = useState<boolean | null>(false);
  const user = useAppStore(authSelectors.user);

  useEffect(() => {
    if (user?.username === username) {
      setIsSelf(true);
      setProfile(user);
    } else {
      setIsSelf(false);
      const fetchUser = async () => {
        const res = await getUserService(undefined, username);
        setProfile(res);
      };
      fetchUser();
    }
  }, [username, user]);

  return {
    isSelf,
    profile,
  };
};
