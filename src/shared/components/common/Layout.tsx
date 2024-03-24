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
      <Header className="w-full !h-[72px] !py-1 !bg-white">
        <Navbar />
      </Header>
      <Content className="overflow-scroll h-[calc(100vh_-_72px)]">
        {children}
        <MobileNavbar />
      </Content>
    </Layout>
  );
};
