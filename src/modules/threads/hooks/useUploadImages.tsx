import { useState } from "react";
import { message } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { useUploadThing } from "@/src/shared/infra/uploadthing";
import { UploadChangeParam } from "antd/es/upload";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export type Preview = {
  type: string;
  preview: string;
  uid: string;
};

export const useUploadImages = () => {
  const [previews, setPreviews] = useState<Preview[][]>([[]]);
  const [fileList, setFileList] = useState<UploadFile[][]>([[]]);

  const { startUpload } = useUploadThing("imagesUploader");

  const uploadImages = async () => {
    const promiseResult = fileList?.map(async (row: UploadFile[]) => {
      const reparedRow = row.map((file) => file.originFileObj) as File[];
      const rowResult = await startUpload(reparedRow);
      return rowResult;
    });
    const result = await Promise.all(promiseResult);

    return result;
  };

  const handleRemove = (uid: string, key: number) => {
    const currentFileList = fileList[key];
    const removedFileList = [
      ...currentFileList.filter((item) => item.uid !== uid),
    ];
    const newFileList = [...fileList];
    newFileList[key] = removedFileList;
    setFileList(newFileList);

    const currentPreview = previews[key];
    const removedReview = [
      ...currentPreview.filter((item) => item.uid !== uid),
    ];
    const newPreviews = [...previews];
    newPreviews[key] = removedReview;
    setPreviews(newPreviews);

    if (removedReview.length === 0) return true;
  };

  const handleRemoveRow = (key: number) => {
    setFileList((fileList) => {
      return fileList.map((files: UploadFile<any>[], index: number) =>
        index === key ? [] : files
      );
    });
    setPreviews((previews) => {
      return previews.map((preview, index) => {
        return index === key ? [] : preview;
      });
    });
  };

  const handleAddRow = () => {
    setPreviews((previews) => {
      const newPreviews = [...previews];
      newPreviews.push([]);
      return newPreviews;
    });
    setFileList((fileList) => {
      const newfileList = [...fileList];
      newfileList.push([]);
      return fileList;
    });
  };

  const handleClear = () => {
    setFileList([[]]);
    setPreviews([[]]);
  };

  const beforeUpload = (file: FileType) => {
    const { type, size } = file;
    const rootType = type?.split("/")?.[0];
    const isLt2M = size ? size / 1024 / 1024 < 2 : 0;
    const isMediaType = rootType === "image" || rootType === "video";
    if (!isMediaType) {
      message.error("You can only upload JPG/PNG file!");
      return false;
    }
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
      return false;
    }
    return isMediaType && isLt2M;
  };

  const handleChange = (
    { fileList: _fileList, file }: UploadChangeParam<UploadFile<any>>,
    key: number
  ) => {
    const { originFileObj, status, type, uid } = file;

    if (!originFileObj) return false;

    const rootType = type?.split("/")?.[0];

    if (status === "done") {
      const objectUrl = URL.createObjectURL(originFileObj);
      const currentPreview = previews[key] ?? [];
      const addedPreview = [
        ...currentPreview,
        {
          type: rootType ?? "",
          preview: objectUrl,
          uid,
        },
      ];
      const newPreviews = [...previews];
      newPreviews[key] = addedPreview;
      setPreviews(newPreviews);
    }

    const newFileList = [...fileList];
    newFileList[key] = [..._fileList];
    setFileList(newFileList);

    return true;
  };

  return {
    beforeUpload,
    fileList,
    handleChange,
    handleClear,
    handleAddRow,
    handleRemove,
    handleRemoveRow,
    previews,
    uploadImages,
  };
};
