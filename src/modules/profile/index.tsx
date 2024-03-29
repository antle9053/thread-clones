"use client";

import { Avatar, Col, Row, Skeleton } from "antd";
import { useAppStore } from "@/src/shared/infra/zustand";
import { authSelectors } from "@/src/shared/infra/zustand/slices/authSlice";
import { User2Icon } from "lucide-react";

export const Profile = () => {
  const user = useAppStore(authSelectors.user);

  if (!user) return <Skeleton />;

  return (
    <div className="mx-auto w-[600px] max-w-full p-4">
      <Row justify="space-between" align="middle">
        <Col span="auto">
          <h1 className="text-[28px] leading-[1.25] text-black font-bold">
            {user.name}
          </h1>
          <p className="text-base text-black font-semibold">{user.username}</p>
        </Col>
        <Avatar
          src={
            !user?.avatar ? (
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
    </div>
  );
};
