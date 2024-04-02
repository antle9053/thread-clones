import { FC } from "react";
import { Preview } from "../hooks/useUploadImages";
import { X } from "lucide-react";

interface MediaPreviewsProps {
  handleRemove: (uid: string) => void;
  previews: Preview[];
}
export const MediaPreviews: FC<MediaPreviewsProps> = ({
  handleRemove,
  previews,
}) => {
  return (
    <div className="flex w-full overflow-scroll flex-nowrap gap-2">
      {previews.length === 1 ? (
        <div className="relative w-full rounded-xl overflow-hidden">
          <div
            className="absolute top-2 right-2 w-8 h-8 bg-black/40 rounded-full flex justify-center items-center"
            onClick={() => {
              handleRemove(previews[0].uid);
            }}
          >
            <X strokeWidth={2} color="white" />
          </div>
          {previews[0].type === "image" ? (
            <img src={previews[0].preview} className="object-contain h-full" />
          ) : null}
        </div>
      ) : (
        previews.map((previewItem, index) => {
          const { type, preview } = previewItem;
          return (
            <div
              className="relative h-[280px] flex-none max-w-[400px] rounded-xl overflow-hidden"
              key={index}
            >
              <div
                className="absolute top-2 right-2 w-8 h-8 bg-black/40 rounded-full flex justify-center items-center"
                onClick={() => {
                  handleRemove(previewItem.uid);
                }}
              >
                <X strokeWidth={2} color="white" />
              </div>
              {type === "image" ? (
                <img src={preview} className="object-cover h-full" />
              ) : null}
            </div>
          );
        })
      )}
    </div>
  );
};
