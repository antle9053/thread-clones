import { Heart } from "lucide-react";
import { Dispatch, FC, SetStateAction } from "react";
import { useLike } from "../hooks/useLike";

interface LikeProps {
  threadId: string;
  setInitLike: Dispatch<SetStateAction<number>>;
}

export const Like: FC<LikeProps> = ({ threadId, setInitLike }) => {
  const { handleLike, handleUnlike, liked } = useLike({
    threadId,
    setInitLike,
  });

  return (
    <div className="h-full w-[36px] flex items-center">
      <Heart
        fill={liked ? "red" : "white"}
        stroke={liked ? "red" : "black"}
        onClick={(e) => {
          e.stopPropagation();
          if (liked) {
            handleUnlike(threadId);
          } else {
            handleLike(threadId);
          }
        }}
      />
    </div>
  );
};
