import { FC } from "react";
import { useClerk } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/src/shared/infra/zustand";
import { authSelectors } from "@/src/shared/infra/zustand/slices/authSlice";

type MoreProps = {
  onSetApperance: () => void;
};

export const More: FC<MoreProps> = ({ onSetApperance }) => {
  const { signOut } = useClerk();
  const router = useRouter();
  const logOut = useAppStore(authSelectors.logOut);
  return (
    <div>
      <div
        className="!py-2 !px-3 cursor-pointer dark:bg-[#222222] border-b border-solid border-gray-200 dark:border-gray-600"
        onClick={onSetApperance}
      >
        <span className="dark:text-white text-base font-[500]">Apperance</span>
      </div>
      <div className="!py-2 !px-3 cursor-pointer dark:bg-[#222222] border-b border-solid border-gray-200 dark:border-gray-600">
        <span className="dark:text-white text-base font-[500]">Apperance</span>
      </div>
      <div
        className="!py-2 !px-3 cursor-pointer dark:bg-[#222222]"
        onClick={() =>
          signOut(() => {
            router.push("/sign-in");
            logOut();
          })
        }
      >
        <span className="dark:text-white text-base font-[500]">Log out</span>
      </div>
    </div>
  );
};
