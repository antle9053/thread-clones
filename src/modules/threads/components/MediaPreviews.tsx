import { FC } from "react";
import { Preview } from "../hooks/useUploadImages";
import { X } from "lucide-react";
import ReactPlayer from "react-player";

interface MediaPreviewsProps {
  handleRemove: (uid: string) => void;
  previews: Preview[];
}
export const MediaPreviews: FC<MediaPreviewsProps> = ({
  handleRemove,
  previews,
}) => {
  return (
    <div className="flex w-full overflow-scroll flex-nowrap gap-2 mb-2">
      {!previews || previews.length === 0 ? null : previews.length === 1 ? (
        <div className="relative flex justify-center w-full rounded-xl overflow-hidden border border-solid border-slate-200">
          <div
            className="absolute top-2 right-2 w-8 h-8 bg-black/40 rounded-full flex justify-center items-center z-[99]"
            onClick={() => {
              handleRemove(previews[0].uid);
            }}
          >
            <X strokeWidth={2} color="white" />
          </div>
          {previews[0].type === "image" ? (
            <img
              src={previews[0].preview}
              className="object-contain h-full max-h-[400px]"
            />
          ) : (
            <ReactPlayer
              controls
              height="auto"
              muted
              playing
              pip
              url={previews[0].preview}
              width="100%"
            />
          )}
        </div>
      ) : (
        previews.map((previewItem, index) => {
          const { type, preview } = previewItem;
          return (
            <div
              className="relative h-[280px] flex-none rounded-xl overflow-hidden"
              key={index}
            >
              <div
                className="absolute top-2 right-2 w-8 h-8 bg-black/40 rounded-full flex justify-center items-center z-[99]"
                onClick={() => {
                  handleRemove(previewItem.uid);
                }}
              >
                <X strokeWidth={2} color="white" />
              </div>
              {type === "image" ? (
                <img src={preview} className="object-cover h-full" />
              ) : (
                <ReactPlayer
                  controls
                  height="100%"
                  muted
                  playing
                  pip
                  url={preview}
                  width="100%"
                  //className="react-player-mutiple"
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );
};
