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

interface CreateThreadProps {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

export const CreateThread: FC<CreateThreadProps> = ({ isOpen, setOpen }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title="New Thread"
      className="create-thread-modal"
      open={isOpen}
      footer={[]}
      onCancel={() => {
        setOpen(false);
      }}
    >
      <Form autoComplete="off" className="w-full" form={form}>
        <Form.Item className="w-full">
          <Button
            type="primary"
            htmlType="submit"
            className="bg-primary w-full h-[40px]"
          >
            Post
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
