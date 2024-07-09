"use client";

import { Input } from "antd";
import { ChevronRight, SearchIcon } from "lucide-react";
import { useSearch } from "./hooks/useSearch";
import _ from "lodash";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { SearchThreads } from "./SearchThreads";
import { UserItem } from "@/src/shared/components/others/UserItem/UserItem";
import { useHandleFollow } from "@/src/shared/hooks/useHandleFollow";

export const Search = () => {
  const { focus, setFocus, searchText, setSearchText, users, handleChange } =
    useSearch();
  const { handleFollow, handleUnfollow } = useHandleFollow();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const query = searchParams?.get("q");

  return (
    <div className="min-h-full bg-white">
      <div className="px-6 pt-1.5 flex justify-between items-center">
        <Input
          allowClear
          className="flex-1"
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          size="large"
          placeholder="Search"
          prefix={<SearchIcon className="mr-1" color="#999999" size={20} />}
          value={searchText}
          onChange={handleChange}
        />
        {focus || searchText ? (
          <div className="flex-0 ml-3">
            <span className="text-base" onClick={() => setSearchText("")}>
              Cancel
            </span>
          </div>
        ) : null}
      </div>
      {searchText ? (
        <div
          className="mt-4 flex items-center px-4"
          onClick={() => {
            const params = new URLSearchParams(searchParams);
            params.set("q", searchText);
            replace(`${pathname}?${params.toString()}`);
          }}
        >
          <div className="flex-0 w-[28px] ml-2 mr-4">
            <SearchIcon color="#666666" size={20} />
          </div>
          <div className="flex-1 flex justify-between border-b border-solid border-black/15 py-4">
            <span className="font-bold">Search for &#34;{searchText}&#34;</span>
            <ChevronRight color="#999999" size={18} />
          </div>
        </div>
      ) : null}
      {focus ? (
        <div className="mt-4">
          {users.map((user, index) => {
            return (
              <UserItem
                key={index}
                profile={user}
                handleFollow={handleFollow}
                handleUnfollow={handleUnfollow}
                showFollow
              />
            );
          })}
        </div>
      ) : null}
      {query && !focus ? <SearchThreads query={query} /> : null}
    </div>
  );
};
