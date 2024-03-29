import { useEffect, useState } from "react";
import { message } from "antd";
import type { GetProp, UploadProps } from "antd";
import { useUploadThing } from "../infra/uploadthing";
import { ClientUploadedFileData } from "uploadthing/types";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export const useAvatar = () => {
  const [preview, setPreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const { startUpload } = useUploadThing("imageUploader");

  useEffect(() => {
    if (!selectedFile) {
      setPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
      return;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
      return;
    }

    setSelectedFile(file);
    return isJpgOrPng && isLt2M;
  };

  const removeImage = () => {
    setSelectedFile(undefined);
  };

  const uploadImage = async () => {
    let uploadedImage;
    if (selectedFile) {
      uploadedImage = await startUpload([selectedFile]);
    } else {
      return null;
    }
    if (!uploadedImage) {
      return null;
    }

    return uploadedImage?.[0].url;
  };

  return {
    beforeUpload,
    preview,
    removeImage,
    uploadImage,
  };
};
