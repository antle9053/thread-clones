"use client";

import { useState } from "react";
import { Avatar, Button, Col, Row, Skeleton } from "antd";
import { useAppStore } from "@/src/shared/infra/zustand";
import { authSelectors } from "@/src/shared/infra/zustand/slices/authSlice";
import { User2Icon } from "lucide-react";
import { EditProfile } from "@/src/shared/components/common/Modal/EditProfile";

export const Profile = () => {
  const [isOpenEditProfile, setOpenEditProfile] = useState<boolean>(false);
  const user = useAppStore(authSelectors.user);

  if (!user) return <Skeleton />;

  return (
    <div className="mx-auto w-[600px] max-w-full p-4">
      <Row justify="space-between" align="middle" className="mb-6">
        <Col span="auto">
          <h1 className="text-[28px] leading-[1.25] text-black font-bold">
            {user.name}
          </h1>
          <p className="text-base text-black font-semibold">{user.username}</p>
        </Col>
        <Avatar
          src={
            user?.avatar ? (
              <img src={user.avatar || ""} alt="avatar" />
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
            0 followers
          </p>
        </Col>
      </Row>

      <Button
        type="primary"
        className="bg-primary w-full"
        onClick={() => setOpenEditProfile(true)}
      >
        Edit Profile
      </Button>

      <EditProfile isOpen={isOpenEditProfile} setOpen={setOpenEditProfile} />
    </div>
  );
};
