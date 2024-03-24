import { ReactNode, ReactElement } from "react";
import { Home, Search, PencilLine, Heart, User } from "lucide-react";

export type MenuItem = {
  icon: ReactElement;
  link?: string;
  title?: string;
};

export const menu = [
  {
    icon: <Home />,
    link: "/",
  },
  {
    icon: <Search />,
    link: "/search",
  },
  {
    icon: <PencilLine />,
  },
  {
    icon: <Heart />,
  },
  {
    icon: <User />,
  },
];
