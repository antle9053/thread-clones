import { useFollow } from "@/src/shared/hooks/useFollows";
import { formatNumber } from "@/src/shared/utils/numbers/formatNumber";
import { Button, Drawer, Tabs } from "antd";
import type { TabsProps } from "antd";
import { FC } from "react";

interface UserItemProps {
  profile: any;
}

const UserItem: FC<UserItemProps> = ({ profile }) => {
  return (
    <div className="flex p-4 !pb-0">
      <div className="flex-0 pr-4">
        <img
          className="object-cover w-[36px] h-[36px] rounded-full"
          src={profile.avatar}
        />
      </div>
      <div className="flex-1 flex justify-between items-center border-b border-solid border-slate-300 pb-4 min-h-[36px]">
        <div className="flex flex-col">
          <span className="font-bold text-black">{profile.name}</span>
          <span className="font-[400] text-[#999999]">{profile.username}</span>
        </div>
        <div>
          <Button>Follow</Button>
        </div>
      </div>
    </div>
  );
};

export const Follows = () => {
  const { isOpen, handleClose, listFolloweds, listFollowings, profile } =
    useFollow();

  const items: TabsProps["items"] = [
    {
      key: "followers",
      label: (
        <div className="flex flex-col">
          <span>Followers</span>
          <span className="text-sm font-thin">
            {formatNumber(listFolloweds.length)}
          </span>
        </div>
      ),
      children: (
        <>
          {listFolloweds.length === 0 ? (
            <div className="p-6 flex justify-center">
              <span className="text-[#999999]">
                {profile.username} isn&apos;t followed by anyone yet.
              </span>
            </div>
          ) : (
            listFolloweds.map((item: any, index: number) => (
              <UserItem key={index} profile={item} />
            ))
          )}
        </>
      ),
    },
    {
      key: "followings",
      label: (
        <div className="flex flex-col">
          <span>Followings</span>
          <span className="text-sm font-thin">
            {formatNumber(listFollowings.length)}
          </span>
        </div>
      ),
      children: (
        <>
          {listFollowings.length === 0 ? (
            <div className="p-6 flex justify-center">
              <span className="text-[#999999]">
                {profile.username} isn&apos;t following anyone yet.
              </span>
            </div>
          ) : (
            listFollowings.map((item: any, index: number) => (
              <UserItem key={index} profile={item} />
            ))
          )}
        </>
      ),
    },
  ];
  return (
    <Drawer
      id="follows-drawer"
      closable={false}
      onClose={handleClose}
      open={isOpen}
      placement="bottom"
    >
      <Tabs
        id="follows-tabs"
        centered
        className=""
        defaultActiveKey="reposts"
        items={items}
      />
    </Drawer>
  );
};
