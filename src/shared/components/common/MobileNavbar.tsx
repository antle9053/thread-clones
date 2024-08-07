import { cloneElement, useEffect, useState } from "react";
import { menu } from "../../constants/common/menu";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { EditProfile } from "./Modal/EditProfile";
import { useAppStore } from "../../infra/zustand";
import { authSelectors } from "../../infra/zustand/slices/authSlice";
import { Badge, message } from "antd";
import { threadsSelectors } from "@/src/modules/threads/zustand/threadsSlice";
import { notificationSelectors } from "../../infra/zustand/slices/notificationSlice";

export const MobileNavbar = () => {
  const [isOpenEditProfile, setOpenEditProfile] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();

  const user = useAppStore(authSelectors.user);
  const setOpenCreateThread = useAppStore(threadsSelectors.setOpenCreateThread);

  const unreadCount = useAppStore(notificationSelectors.unreadCount);

  return (
    <>
      <nav className="flex w-full justify-between md:hidden absolute left-0 bottom-0 h-12 backdrop-blur-xl">
        {menu.map((item, index) => {
          const username = user?.username;
          const isActive =
            pathname === `/@${username}`
              ? item.name === "user"
              : item.link === pathname;
          const icon = cloneElement(item.icon, {
            size: 24,
            strokeWidth: 2,
            className: isActive ? "text-white" : "text-primary",
          });
          return (
            <div
              key={index}
              className={clsx(
                "flex items-center justify-center cursor-pointer grow h-full",
                isActive ? "bg-primary text-white" : "text-primary"
              )}
              onClick={() => {
                if (item.name === "user") {
                  if (username) {
                    router.push(`/@${username}`);
                  } else {
                    message.info(
                      "Update your username to access your user profile"
                    );
                    setOpenEditProfile(true);
                  }
                } else if (item.name === "create") {
                  if (username) {
                    setOpenCreateThread(true);
                  } else {
                    message.info(
                      "Update your username to create ur very first thread"
                    );
                    setOpenEditProfile(true);
                  }
                } else if (item.link) {
                  router.push(item.link);
                }
              }}
            >
              {item.name === "notification" ? (
                <Badge count={unreadCount()} size="small">
                  {icon}
                </Badge>
              ) : (
                icon
              )}
            </div>
          );
        })}
      </nav>
      <EditProfile isOpen={isOpenEditProfile} setOpen={setOpenEditProfile} />
    </>
  );
};
