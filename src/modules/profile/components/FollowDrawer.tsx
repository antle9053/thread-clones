import { useFollow } from "../hooks/useFollow";
import { formatNumber } from "@/src/shared/utils/numbers/formatNumber";
import { Drawer, Tabs } from "antd";
import type { TabsProps } from "antd";
import { UserItem } from "@/src/shared/components/others/UserItem/UserItem";

export const FollowDrawer = () => {
  const {
    isOpen,
    handleClose,
    handleFollow,
    handleUnfollow,
    listFolloweds,
    listFollowings,
    profile,
    userId,
  } = useFollow();

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
                {profile?.username} isn&apos;t followed by anyone yet.
              </span>
            </div>
          ) : (
            listFolloweds.map((item: any, index: number) => (
              <UserItem
                key={index}
                profile={item}
                handleFollow={handleFollow}
                handleUnfollow={handleUnfollow}
                handleClose={handleClose}
                userId={userId}
              />
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
                {profile?.username} isn&apos;t following anyone yet.
              </span>
            </div>
          ) : (
            listFollowings.map((item: any, index: number) => (
              <UserItem
                key={index}
                profile={item}
                handleFollow={handleFollow}
                handleUnfollow={handleUnfollow}
                handleClose={handleClose}
                userId={userId}
              />
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
