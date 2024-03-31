import { ReactElement } from "react";
import { Home, Search, PencilLine, Heart, User } from "lucide-react";

export type MenuItem = {
  icon: ReactElement;
  link?: string;
  title?: string;
  name: string;
};

export const menu = [
  {
    icon: <Home />,
    name: "home",
    link: "/",
  },
  {
    icon: <Search />,
    name: "search",
    link: "/search",
  },
  {
    icon: <PencilLine />,
    name: "create",
  },
  {
    icon: <Heart />,
    name: "",
  },
  {
    icon: <User />,
    name: "user",
  },
];
