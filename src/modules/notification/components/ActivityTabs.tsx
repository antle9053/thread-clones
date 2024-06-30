import { Button } from "antd";
import clsx from "clsx";
import { FC } from "react";
import { tabs } from "../hooks/useNotifications";

interface ActivityTabsProps {
  activeTab: number;
  setActiveTab: (tab: number) => void;
}

export const ActivityTabs: FC<ActivityTabsProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="w-full flex gap-2 p-2 overflow-x-scroll">
      {tabs.map((tab, index) => {
        return (
          <Button
            key={index}
            className={clsx(
              "bg-white text-primary !border-primary font-semibold px-6",
              tab.index === activeTab ? "!bg-primary !text-white" : ""
            )}
            onClick={() => {
              setActiveTab(tab.index);
            }}
          >
            {tab.label}
          </Button>
        );
      })}
    </div>
  );
};
