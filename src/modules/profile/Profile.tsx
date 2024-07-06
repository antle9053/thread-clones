"use client";

import { useState } from "react";
import { Avatar, Button, Col, Row, Skeleton } from "antd";

import { User2Icon } from "lucide-react";
import { EditProfile } from "@/src/shared/components/common/Modal/EditProfile";
import { useParams } from "next/navigation";
import { useProfile } from "./hooks/useProfile";
import { useUser } from "../home/hooks/useUser";
import clsx from "clsx";
import { Content } from "./components/Content";
import { useFollow } from "./hooks/useFollow";

export const Profile = () => {
  const params = useParams<{ username: string }>();
  const { username } = params;
  const [isOpenEditProfile, setOpenEditProfile] = useState<boolean>(false);

  const { isSelf, profile, refetch } = useProfile({
    username: username.replace("%40", ""),
  });

  const { followed, handleFollow, handleUnfollow } = useUser({
    followedId: profile?.id ?? "",
  });

  const { handleOpen, setProfile } = useFollow();

  if (!profile) return <Skeleton />;

  return (
    <div className="mx-auto w-[600px] max-w-full bg-white min-h-[calc(100vh_-_124px)]">
      <Row justify="space-between" align="middle" className="mb-6 px-4 pt-4">
        <Col span="auto">
          <h1 className="text-[28px] leading-[1.25] text-black font-bold">
            {profile.name}
          </h1>
          <p className="text-base text-black font-semibold">
            {profile.username}
          </p>
        </Col>
        <Avatar
          src={
            profile?.avatar ? (
              <img src={profile.avatar || ""} alt="avatar" />
            ) : (
              <div className="!w-[84px] !h-[84px] rouned-full bg-slate-300 flex justify-center items-center">
                <User2Icon size={42} />
              </div>
            )
          }
          size={84}
        />
      </Row>

      <Row justify="start" align="middle" className="mb-6 px-4">
        <Col span="auto">
          <p
            className="text-[15px] hover:underline underline-offset-2 text-[#999999]"
            onClick={() => {
              setProfile(profile);
              handleOpen();
            }}
          >
            {profile.followedByIDs.length} followers
          </p>
        </Col>
      </Row>
      {isSelf ? (
        <div className="px-4">
          <Button
            type="primary"
            className="bg-primary w-full mb-3"
            onClick={() => setOpenEditProfile(true)}
          >
            Edit Profile
          </Button>
        </div>
      ) : (
        <div className="w-full flex gap-4 mb-3 px-4">
          <Button
            type="primary"
            className={clsx(
              "w-1/2 border border-solid border-primary",
              followed ? "!bg-white !text-primary" : "!bg-primary !text-white"
            )}
            onClick={(e) => {
              e.stopPropagation();
              if (followed) handleUnfollow();
              else handleFollow();

              refetch();
            }}
          >
            {followed ? "Following" : "Follow"}
          </Button>
          <Button type="primary" className="bg-primary w-1/2">
            Mention
          </Button>
        </div>
      )}
      <Content profileId={profile.id} />
      {isSelf ? (
        <EditProfile isOpen={isOpenEditProfile} setOpen={setOpenEditProfile} />
      ) : null}
    </div>
  );
};
