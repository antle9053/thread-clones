"use client";

import { useState } from "react";
import { Avatar, Button, Col, Row, Skeleton } from "antd";

import { User2Icon } from "lucide-react";
import { EditProfile } from "@/src/shared/components/common/Modal/EditProfile";
import { useParams } from "next/navigation";
import { useProfile } from "./hooks/useProfile";

export const Profile = () => {
  const params = useParams<{ username: string }>();
  const { username } = params;
  const [isOpenEditProfile, setOpenEditProfile] = useState<boolean>(false);

  const { isSelf, profile } = useProfile({
    username: username.replace("%40", ""),
  });

  if (!profile) return <Skeleton />;

  return (
    <div className="mx-auto w-[600px] max-w-full p-4 bg-white min-h-[calc(100vh_-_124px)]">
      <Row justify="space-between" align="middle" className="mb-6">
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

      <Row justify="start" align="middle" className="mb-6">
        <Col span="auto">
          <p className="text-[15px] hover:underline underline-offset-2 text-[#999999]">
            {profile.followedByIDs.length} followers
          </p>
        </Col>
      </Row>
      {isSelf ? (
        <Button
          type="primary"
          className="bg-primary w-full"
          onClick={() => setOpenEditProfile(true)}
        >
          Edit Profile
        </Button>
      ) : (
        <div className="w-full flex gap-4">
          <Button
            type="primary"
            className="bg-primary w-1/2"
            onClick={() => setOpenEditProfile(true)}
          >
            Follow
          </Button>{" "}
          <Button
            type="primary"
            className="bg-primary w-1/2"
            onClick={() => setOpenEditProfile(true)}
          >
            Mention
          </Button>
        </div>
      )}
      {isSelf ? (
        <EditProfile isOpen={isOpenEditProfile} setOpen={setOpenEditProfile} />
      ) : null}
    </div>
  );
};
