import { useState, ReactElement, cloneElement } from "react";
import Link from "next/link";
import { menu } from "../../constants/common";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { MoreButton } from "./MoreButton";

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="flex w-full justify-between">
      <Link href="/" className="flex items-center gap-4 grow">
        <p className="text-heading3-bold text-light-1 max-xs:hidden text-primary">
          Threads
        </p>
      </Link>
      <div className="hidden md:flex justify-between items-center">
        {menu.map((item, index) => {
          const isActive = item.link === pathname;
          return (
            <div
              key={index}
              className={clsx(
                "px-8 py-5 cursor-pointer rounded-md",
                isActive
                  ? "bg-primary text-white"
                  : "text-primary hover:bg-slate-100"
              )}
              onClick={() => {
                if (item.link) {
                  router.push(item.link);
                }
              }}
            >
              {cloneElement(item.icon, { size: 30, strokeWidth: 2.25 })}
            </div>
          );
        })}
      </div>
      <MoreButton />
    </nav>
  );
};
