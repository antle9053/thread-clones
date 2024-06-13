import { Button } from "antd";
import clsx from "clsx";
import { useEffect, useState } from "react";

const tabs = [
  {
    index: 0,
    label: "All",
  },
  {
    index: 1,
    label: "Followes",
  },
  {
    index: 2,
    label: "Replies",
  },
  {
    index: 3,
    label: "Mentions",
  },
  {
    index: 4,
    label: "Quotes",
  },
  {
    index: 5,
    label: "Reposts",
  },
];

export const ActivityTabs = () => {
  const [activeTab, setActiveTab] = useState(0);

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
