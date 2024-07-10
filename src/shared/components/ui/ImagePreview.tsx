import { Modal } from "antd";
import { X } from "lucide-react";
import { CSSProperties, FC, useState } from "react";

interface ImagePreview {
  imageStyle?: CSSProperties;
  src: string;
}

export const ImagePreview: FC<ImagePreview> = ({ imageStyle, src }) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div
      className="h-full"
      onClick={(e) => {
        e.stopPropagation();
        setOpen(true);
      }}
    >
      <img src={src} style={imageStyle} />
      <Modal
        className="preview-image-modal"
        footer={[]}
        closeIcon={null}
        open={open}
      >
        <div className="w-full h-full bg-black relative flex items-center justify-center">
          <div
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
            className="w-[44px] bg-[#1E1E1E] h-[44px] flex items-center justify-center rounded-full absolute top-4 left-4 text-base text-[#666666]"
          >
            <X size={28} />
          </div>
          <img src={src} className="object-contain h-full" />
        </div>
      </Modal>
    </div>
  );
};
