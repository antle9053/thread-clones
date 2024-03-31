import { cloneElement, useEffect, useState } from "react";
import { menu } from "../../constants/common/menu";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { EditProfile } from "./Modal/EditProfile";
import { useAppStore } from "../../infra/zustand";
import { authSelectors } from "../../infra/zustand/slices/authSlice";
import { message } from "antd";
import { CreateThread } from "./Modal/CreateThread";

export const MobileNavbar = () => {
  const [isOpenEditProfile, setOpenEditProfile] = useState<boolean>(false);
  const [isOpenCreateThread, setOpenCreateThread] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();

  const user = useAppStore(authSelectors.user);

  return (
    <>
      <nav className="flex w-full justify-between md:hidden absolute left-0 bottom-0 h-12 backdrop-blur-xl">
        {menu.map((item, index) => {
          const username = user?.username;
          const isActive =
            pathname === `/@${username}`
              ? item.name === "user"
              : item.link === pathname;
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
                  setOpenCreateThread(true);
                } else if (item.link) {
                  router.push(item.link);
                }
              }}
            >
              {cloneElement(item.icon, { size: 24, strokeWidth: 2 })}
            </div>
          );
        })}
      </nav>
      <EditProfile isOpen={isOpenEditProfile} setOpen={setOpenEditProfile} />
      <CreateThread isOpen={isOpenCreateThread} setOpen={setOpenCreateThread} />
    </>
  );
};
