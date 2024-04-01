import {
  Button,
  Form,
  Input,
  Modal,
  Popover,
  Spin,
  Upload,
  message,
} from "antd";
import { ImagePlus, LoaderCircle } from "lucide-react";
import { useAvatar } from "@/src/shared/hooks/useAvatar";
import { FC, useRef, useState } from "react";
import { UploadRef } from "antd/es/upload/Upload";
import { useAppStore } from "@/src/shared/infra/zustand";
import { authSelectors } from "@/src/shared/infra/zustand/slices/authSlice";
import {
  getUserService,
  updateUserService,
} from "@/src/shared/services/user.service";

interface EditProfileProps {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

export const EditProfile: FC<EditProfileProps> = ({ isOpen, setOpen }) => {
  const [form] = Form.useForm();
  const [openOption, setOpenOption] = useState<boolean>(isOpen);
  const [loading, setLoading] = useState<boolean>(false);

  const { beforeUpload, preview, removeImage, uploadImage } = useAvatar();
  const uploadRef = useRef<UploadRef>(null);

  const user = useAppStore(authSelectors.user);
  const setUser = useAppStore(authSelectors.setUser);

  const handleSubmit = async (formValues: any) => {
    setLoading(true);
    const avatar = await uploadImage();

    if (user?.userId) {
      await updateUserService(user?.userId, {
        name: formValues.fullName,
        username: formValues.username,
        ...(avatar ? { avatar } : {}),
        bio: formValues.bio,
      });
      const response = await getUserService(user?.userId);
      setUser(response);
    } else {
      message.error("Something wrong, please try again");
    }

    setLoading(false);
  };

  return (
    <Modal
      open={isOpen}
      footer={[]}
      onCancel={() => {
        setOpen(false);
      }}
    >
      <Popover
        arrow={false}
        content={
          <div>
            <div
              className="!py-2 !px-3 cursor-pointer dark:bg-[#222222] border-b border-solid border-gray-200 dark:border-gray-600"
              onClick={() => {
                if (uploadRef.current) {
                  // @ts-ignore-next-line
                  uploadRef.current?.upload?.uploader?.fileInput?.click?.();
                  setOpenOption(false);
                }
              }}
            >
              <span className="dark:text-white text-base font-[500]">
                Upload Image
              </span>
            </div>
            {preview ? (
              <div
                className="!py-2 !px-3 font-semibold cursor-pointer dark:bg-[#222222] border-b border-solid border-gray-200 dark:border-gray-600"
                onClick={() => {
                  removeImage();
                  setOpenOption(false);
                }}
              >
                <span className="text-[#FF3040] text-base font-[500]">
                  Remove Current Image
                </span>
              </div>
            ) : null}
          </div>
        }
        onOpenChange={(visible: boolean) => {
          setOpenOption(visible);
        }}
        open={openOption}
        placement="bottom"
        trigger="click"
      >
        <div className="flex justify-center !w-24 h-24 mb-4 rounded-full border border-slate-300 bg-slate-100 border-dashed relative overflow-hidden p-2">
          <Upload
            ref={uploadRef}
            className="h-full"
            name="avatar"
            showUploadList={false}
            beforeUpload={beforeUpload}
            openFileDialogOnClick={false}
            multiple={false}
            onPreview={() => alert("Oh yeah")}
          >
            <div className="!h-[78px] !w-[78px] rounded-full overflow-hidden">
              {preview ? (
                <img src={preview} className="h-full w-full object-cover" />
              ) : user?.avatar ? (
                <img
                  src={user?.avatar}
                  width={78}
                  height={78}
                  className="h-[78px] w-[78px] object-cover"
                />
              ) : (
                <div className="h-full w-full top-0 left-0 absolute flex justify-center items-center">
                  <ImagePlus size={32} strokeWidth={2.25} />
                </div>
              )}
            </div>
          </Upload>
        </div>
      </Popover>
      <Form
        autoComplete="off"
        className="w-full"
        form={form}
        onFinish={async (values: any) => {
          await handleSubmit(values);
          setOpen(false);
        }}
        initialValues={{
          fullName: user?.name || "",
          username: user?.username || "",
          bio: user?.bio || "",
        }}
      >
        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[{ required: true, message: "Enter your full name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Enter your username" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Bio"
          name="bio"
          rules={[{ required: false, message: "Enter your bio" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item className="w-full">
          <Button
            type="primary"
            htmlType="submit"
            className="bg-primary w-full h-[40px]"
            disabled={loading}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
