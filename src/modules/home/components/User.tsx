import { ImagePreview } from "@/src/shared/components/ui/ImagePreview";
import { User } from "@/src/shared/infra/zustand/slices/authSlice";
import { Button, Modal } from "antd";
import { Check, Plus } from "lucide-react";
import { FC, useState } from "react";
import { useUser } from "../hooks/useUser";
import clsx from "clsx";

interface UserProps {
  user: User;
}
export const UserAvatar: FC<UserProps> = ({ user }) => {
  const [open, setOpen] = useState(false);
  const { followed, isSelf, handleFollow, handleUnfollow } = useUser({
    followedId: user.id,
  });
  return (
    <div className="w-[48px] h-[48px] rounded-full relative">
      <ImagePreview
        imageStyle={{
          width: "48px",
          height: "48px",
          borderRadius: "9999px",
        }}
        src={user?.avatar || ""}
      />
      {!isSelf && followed !== null ? (
        <div
          className="absolute bottom-0 right-0 border-2 border-solid border-white rounded-full bg-black p-[2px]"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
        >
          {followed ? (
            <Check color="white" size={10} strokeWidth={4} />
          ) : (
            <Plus color="white" size={10} strokeWidth={4} />
          )}
        </div>
      ) : null}
      <Modal
        open={open}
        centered
        closable={false}
        footer={[]}
        onCancel={(e) => {
          e.stopPropagation();
          setOpen(false);
        }}
      >
        <div className="w-full">
          <div className="w-full flex justify-between items-center">
            <div>
              <div>
                <span className="text-xl font-bold">{user?.name}</span>
              </div>
              <div>
                <span className="text-base">{user?.username}</span>
              </div>
            </div>

            <img
              src={user?.avatar || ""}
              className="w-[64px] h-[64px] rounded-full"
            />
          </div>
          <div>
            <Button
              className={clsx(
                "w-full border border-solid border-black min-h-10 mt-5",
                followed ? "!bg-white !text-black" : "!bg-black !text-white"
              )}
              onClick={(e) => {
                e.stopPropagation();
                if (followed) handleUnfollow();
                else handleFollow();
              }}
            >
              {followed ? "Following" : "Follow"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
