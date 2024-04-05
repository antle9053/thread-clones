import { FC } from "react";
import ReactPlayer from "react-player";

interface MediaProps {
  files: {
    id: string;
    url: string;
    type: string;
  }[];
}
export const Media: FC<MediaProps> = ({ files }) => {
  return (
    <div className="flex w-full overflow-scroll flex-nowrap gap-2 mb-2">
      {files.length === 1 ? (
        <div className="relative w-full rounded-xl overflow-hidden">
          {files[0].type.includes("image") ? (
            <img src={files[0].url} className="object-contain h-full" />
          ) : (
            <ReactPlayer
              controls
              height="auto"
              muted
              playing
              pip
              url={files[0].url}
              width="100%"
            />
          )}
        </div>
      ) : (
        files.map((file, index) => {
          const { url, type } = file;
          return (
            <div
              className="relative h-[280px] flex-none max-w-[400px] rounded-xl overflow-hidden"
              key={index}
            >
              {type.includes("image") ? (
                <img src={url} className="object-cover h-full" />
              ) : (
                <ReactPlayer
                  controls
                  height="100%"
                  muted
                  playing
                  pip
                  url={url}
                  width="100%"
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );
};
