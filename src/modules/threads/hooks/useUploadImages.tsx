import { useState } from "react";
import { message } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { useUploadThing } from "@/src/shared/infra/uploadthing";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export type Preview = {
  type: string;
  preview: string;
  uid: string;
};

export const useUploadImages = () => {
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { startUpload } = useUploadThing("imageUploader");

  const uploadImages = async (): Promise<any> => {
    let uploadedImage;

    const reparedImages: FileType[] = fileList
      .filter((file) => file.originFileObj !== undefined)
      .map((file) => file.originFileObj) as FileType[];

    uploadedImage = await startUpload(reparedImages);

    if (!uploadedImage) {
      return null;
    }

    return uploadedImage;
  };

  const handleRemove = (uid: string) => {
    setFileList((fileList) => fileList.filter((file) => file.uid !== uid));
    setPreviews((previews) => previews.filter((file) => file.uid !== uid));
  };

  const handleChange: UploadProps["onChange"] = ({
    fileList: newFileList,
    file,
  }) => {
    const { originFileObj, size, status, type, uid } = file;

    const mediaType = type?.split("/")?.[0];
    if (mediaType !== "image" && mediaType !== "video") {
      message.error("You can only upload IMAGE or VIDEO file!");
      return;
    }
    const isLt2M = size ? size / 1024 / 1024 < 2 : 0;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
      return;
    }

    if (originFileObj && status === "done") {
      const objectUrl = URL.createObjectURL(originFileObj);
      setPreviews((previews) => [
        ...previews,
        {
          type: mediaType,
          preview: objectUrl,
          uid,
        },
      ]);
    }
    console.log(newFileList);
    setFileList(newFileList);
  };

  return {
    fileList,
    handleChange,
    handleRemove,
    previews,
    uploadImages,
  };
};
