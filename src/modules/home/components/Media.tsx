import { FC } from "react";
import { X } from "lucide-react";

interface MediaProps {
  files: {
    id: string;
    url: string;
  }[];
}
export const Media: FC<MediaProps> = ({ files }) => {
  return (
    <div className="flex w-full overflow-scroll flex-nowrap gap-2">
      {files.length === 1 ? (
        <div className="relative w-full rounded-xl overflow-hidden">
          {true ? (
            <img src={files[0].url} className="object-contain h-full" />
          ) : null}
        </div>
      ) : (
        files.map((file, index) => {
          const { url } = file;
          return (
            <div
              className="relative h-[280px] flex-none max-w-[400px] rounded-xl overflow-hidden"
              key={index}
            >
              {true ? <img src={url} className="object-cover h-full" /> : null}
            </div>
          );
        })
      )}
    </div>
  );
};
