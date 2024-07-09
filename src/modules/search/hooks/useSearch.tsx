import { getUsersService } from "@/src/shared/services/user.service";
import { ChangeEvent, useEffect, useState } from "react";
import { UserWithFollow } from "../../profile/zustand/followSlice";
import { useAppStore } from "@/src/shared/infra/zustand";
import { authSelectors } from "@/src/shared/infra/zustand/slices/authSlice";
import _ from "lodash";

export const useSearch = () => {
  const [focus, setFocus] = useState<boolean>(false);
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState<UserWithFollow[]>([]);
  const [timeoutId, setTimeoutId] = useState<any>(null);

  const user = useAppStore(authSelectors.user);

  const fetchUsers = async (searchText: string) => {
    const data = await getUsersService(searchText);

    setUsers([
      ...data.map((item) => {
        const isFollowed = item.followedByIDs.includes(user?.id!);
        const isFollowing = item.followingIDs.includes(user?.id!);
        return {
          ...item,
          isFollowed,
          isFollowing,
        };
      }),
    ]);
  };

  const debounceFetchUsers = _.debounce(fetchUsers, 300);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;
    setSearchText(newText);

    clearTimeout(timeoutId);
    const newTimeoutId = setTimeout(() => debounceFetchUsers(newText), 300);
    setTimeoutId(newTimeoutId);
  };

  return {
    debounceFetchUsers,
    focus,
    setFocus,
    searchText,
    setSearchText,
    users,
    handleChange,
  };
};
