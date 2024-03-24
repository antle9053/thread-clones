import { List } from "antd";
import { FC, useState } from "react";
import { Apperance } from "./Apperance";

export const More: FC = () => {
  const [apperance, setApperance] = useState<boolean>(false);

  if (apperance) return <Apperance />;

  return (
    <List>
      <List.Item onClick={() => setApperance(true)}>Apperance</List.Item>
      <List.Item>Liked</List.Item>
      <List.Item>Saved</List.Item>
    </List>
  );
};
