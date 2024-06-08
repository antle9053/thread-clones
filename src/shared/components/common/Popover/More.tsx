import { FC } from "react";
import { useClerk } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/src/shared/infra/zustand";
import { authSelectors } from "@/src/shared/infra/zustand/slices/authSlice";
import Link from "next/link";
import { removeSocketIdService } from "@/src/shared/services/user.service";

type MoreProps = {
  onSetApperance: () => void;
  onClose: () => void;
};

export const More: FC<MoreProps> = ({ onClose, onSetApperance }) => {
  const { signOut } = useClerk();
  const router = useRouter();
  const logOut = useAppStore(authSelectors.logOut);
  const user = useAppStore(authSelectors.user);
  return (
    <div>
      <div
        className="!py-2 !px-3 cursor-pointer dark:bg-[#222222] border-b border-solid border-gray-200 dark:border-gray-600"
        onClick={onSetApperance}
      >
        <span className="dark:text-white text-base font-[500]">Apperance</span>
      </div>
      <div className="!py-2 !px-3 cursor-pointer dark:bg-[#222222] border-b border-solid border-gray-200 dark:border-gray-600">
        <Link href="/liked" onClick={onClose}>
          <span className="dark:text-white text-base font-[500]">
            Your likes
          </span>
        </Link>
      </div>
      <div className="!py-2 !px-3 cursor-pointer dark:bg-[#222222] border-b border-solid border-gray-200 dark:border-gray-600">
        <Link href="/saved" onClick={onClose}>
          <span className="dark:text-white text-base font-[500]">Saved</span>
        </Link>
      </div>
      <div
        className="!py-2 !px-3 cursor-pointer dark:bg-[#222222]"
        onClick={async () => {
          await removeSocketIdService(user?.userId!);
          signOut(async () => {
            router.push("/sign-in");
            logOut();
          });
        }}
      >
        <span className="dark:text-white text-base font-[500]">Log out</span>
      </div>
    </div>
  );
};
