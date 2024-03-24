import { cloneElement } from "react";
import { menu } from "../../constants/common/menu";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";

export const MobileNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <nav className="flex w-full justify-between md:hidden absolute left-0 bottom-0 h-12 backdrop-blur-xl">
      {menu.map((item, index) => {
        const isActive = item.link === pathname;
        return (
          <div
            key={index}
            className={clsx(
              "flex items-center justify-center cursor-pointer grow h-full",
              isActive ? "bg-primary text-white" : "text-primary"
            )}
            onClick={() => {
              if (item.link) {
                router.push(item.link);
              }
            }}
          >
            {cloneElement(item.icon, { size: 24, strokeWidth: 2.25 })}
          </div>
        );
      })}
    </nav>
  );
};
