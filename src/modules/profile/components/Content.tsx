import { Tabs } from "antd";
import type { TabsProps } from "antd";
import { FC } from "react";
import { Home } from "../../home";

interface ContentProps {
  profileId: string;
}

export const Content: FC<ContentProps> = ({ profileId }) => {
  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "threads",
      label: "Threads",
      children: <Home pageType="profile" profileId={profileId} />,
    },
    {
      key: "replies",
      label: "Replies",
      children: <Home pageType="replies" profileId={profileId} />,
    },
    {
      key: "reposts",
      label: "Reposts",
      children: "Content of Tab Pane 3",
    },
  ];

  return (
    <Tabs
      id="content-tabs"
      centered
      className=""
      defaultActiveKey="threads"
      items={items}
      onChange={onChange}
    />
  );
};
