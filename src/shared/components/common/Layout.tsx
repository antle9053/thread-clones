"use client";

import { Layout } from "antd";
import { Navbar } from "./Navbar";
import { MobileNavbar } from "./MobileNavbar";

const { Header, Content } = Layout;

export const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Layout>
      <Header className="w-full !h-[76px] !py-1 !bg-white dark:!bg-dark-header">
        <Navbar />
      </Header>
      <Content className="overflow-scroll h-[calc(100vh_-_76px)]">
        {children}
        <MobileNavbar />
      </Content>
    </Layout>
  );
};
