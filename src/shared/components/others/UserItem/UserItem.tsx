import { UserWithFollow } from "@/src/modules/profile/zustand/followSlice";
import { Button } from "antd";
import clsx from "clsx";
import { Heart, Quote, Repeat } from "lucide-react";
import { FC } from "react";
import { useRouter } from "next/navigation";

interface UserItemProps {
  profile: UserWithFollow;
  handleFollow: (followedId: string) => void;
  handleUnfollow: (followedId: string) => void;
  handleClose?: () => void;
  userId?: string;
  activityType?: string;
  showFollow?: boolean;
}

export const UserItem: FC<UserItemProps> = ({
  profile,
  userId,
  activityType,
  handleClose,
  showFollow,
  handleFollow,
  handleUnfollow,
}) => {
  const router = useRouter();
  const numOfFollows = profile?.followedByIDs?.length ?? 0;
  const renderActivity = (activity: string) => {
    switch (activity) {
      case "like": {
        return (
          <div className="rounded-full flex justify-center items-center bg-[#fe0169] w-[22px] h-[22px] border-2 border-solid border-white">
            <Heart color="white" fill="white" size={10} />
          </div>
        );
      }
      case "repost": {
        return (
          <div className="rounded-full flex justify-center items-center bg-[#c329bf] w-[22px] h-[22px] border-2 border-solid border-white">
            <Repeat color="white" fill="white" size={10} />
          </div>
        );
      }
      case "quote": {
        return (
          <div className="rounded-full flex justify-center items-center bg-[#fe7900] w-[22px] h-[22px] border-2 border-solid border-white">
            <Quote color="white" fill="white" size={9} />
          </div>
        );
      }
      default: {
        return null;
      }
    }
  };
  return (
    <div className={clsx("flex p-4 !pb-0", activityType ? "!px-0" : "")}>
      <div className="flex-0 pr-4">
        <div className="relative h-fit w-fit">
          <img
            className="object-cover w-[36px] h-[36px] rounded-full"
            src={profile?.avatar || ""}
          />
          {activityType ? (
            <div className="absolute -bottom-2 -right-2">
              {renderActivity(activityType)}
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex-1  border-b border-solid border-slate-300 pb-4 min-h-[36px]">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="font-bold text-black">{profile.name}</span>
            <span
              className="font-[400] text-[#999999]"
              onClick={() => {
                handleClose?.();
                router.push(`/@${profile.username}`);
              }}
            >
              {profile.username}
            </span>
          </div>
          <div>
            {profile.id === userId ? null : (
              <Button
                onClick={() => {
                  profile.isFollowed
                    ? handleUnfollow(profile.id)
                    : handleFollow(profile.id);
                }}
                className={clsx(
                  !profile.isFollowed
                    ? "bg-primary text-white"
                    : "border border-solid border-primary text-primary"
                )}
              >
                {profile.isFollowed
                  ? "Following"
                  : profile.isFollowing
                  ? "Follow Back"
                  : "Follow"}
              </Button>
            )}
          </div>
        </div>
        {showFollow ? (
          <div className="mt-2">
            {numOfFollows} follower{numOfFollows > 1 ? "s" : ""}
          </div>
        ) : null}
      </div>
    </div>
  );
};
