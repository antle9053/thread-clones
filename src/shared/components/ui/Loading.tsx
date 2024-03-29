import { FC } from "react";

interface LoadingProps {
  fullPage?: boolean;
}

export const Loading: FC<LoadingProps> = ({ fullPage = true }) => {
  const spiner = (
    <div className="relative">
      <div className="h-24 w-24 rounded-full border-solid border-t-8 border-b-8 border-gray-200"></div>
      <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-solid border-t-8 border-b-8 border-primary animate-spin"></div>
    </div>
  );
  return fullPage ? (
    <div className="flex items-center justify-center h-screen bg-white dark:bg-[#333333]">
      {spiner}
    </div>
  ) : (
    spiner
  );
};
