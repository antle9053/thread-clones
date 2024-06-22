"use client";

import { useEffect, useState } from "react";
import { Layout } from "antd";
import { Navbar } from "./Navbar";
import { MobileNavbar } from "./MobileNavbar";
import { useUser } from "@clerk/nextjs";
import {
  getUserByUserIdService,
  updateSocketIdService,
} from "../../services/user.service";
import { useAppStore } from "../../infra/zustand";
import { authSelectors } from "../../infra/zustand/slices/authSlice";
import { Loading } from "../ui/Loading";
import { CreateThread } from "@/src/modules/threads/CreateThread";
import { ThreadAction } from "./Drawer/ThreadAction";
import { Repost } from "./Drawer/Repost";
import { Follows } from "./Drawer/Follows";
import { Activity } from "./Drawer/Activity";
import { socket } from "../../infra/socket.io";

const { Header, Content } = Layout;

export const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const setUser = useAppStore(authSelectors.setUser);
  const userInfo = useAppStore(authSelectors.user);

  useEffect(() => {
    const init = async () => {
      if (isSignedIn) {
        if (socket.connected && socket.id) {
          const socketId = socket.id;
          await updateSocketIdService(user.id, socketId);
        }
      }
      if (!userInfo) {
        if (isLoaded && user && isSignedIn) {
          const response = await getUserByUserIdService(user.id);
          setUser(response);
        }
      }
    };
    init();
  }, [isLoaded, isSignedIn, user, userInfo, socket.connected, socket.id]);

  if (!user) return <Loading fullPage />;

  return (
    <Layout>
      <Header className="w-full !h-[76px] !py-1 !bg-white dark:!bg-dark-header">
        <Navbar />
      </Header>
      <Content className="overflow-scroll h-[calc(100vh_-_76px)]">
        {children}
        <MobileNavbar />
        <CreateThread />
        <ThreadAction />
        <Repost />
        <Follows />
        <Activity />
      </Content>
    </Layout>
  );
};
