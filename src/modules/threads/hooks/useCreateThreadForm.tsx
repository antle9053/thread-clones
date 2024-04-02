import { useEffect, useState } from "react";
import { useAppStore } from "@/src/shared/infra/zustand";
import { authSelectors } from "@/src/shared/infra/zustand/slices/authSlice";
import { Form, message } from "antd";
import { threadsSelectors } from "../zustand/threadsSlice";
import {
  GetReplyThreadResponse,
  createThreadService,
  getThreadService,
} from "@/src/shared/services/thread.service";

interface UseThreadFormProps {
  beforeSubmit?: () => Promise<any>;
}

export const useCreateThreadForm = ({ beforeSubmit }: UseThreadFormProps) => {
  const [form] = Form.useForm();
  const [messageApi] = message.useMessage();
  const [thread, setThread] = useState<GetReplyThreadResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const user = useAppStore(authSelectors.user);
  const setOpen = useAppStore(threadsSelectors.setOpenCreateThread);
  const replyTo = useAppStore(threadsSelectors.replyTo);

  const [isOpenConfirmDiscard, setOpenConfirmDiscard] =
    useState<boolean>(false);

  const threadsValue = Form.useWatch("threads", form);
  const currentValue = threadsValue?.[threadsValue.length - 1]?.text;
  const disableSubmit = threadsValue?.some(
    (thread: any) => thread?.text === "" || thread === undefined
  );

  useEffect(() => {
    if (replyTo) {
      const initThread = async () => {
        try {
          setLoading(true);
          const result = await getThreadService(replyTo);
          setThread(result);
          setLoading(false);
        } catch (error) {
          message.error("Error");
          setLoading(false);
        }
      };
      initThread();
    } else {
      setThread(null);
    }
  }, [replyTo]);

  const onFinish = async (values: any) => {
    try {
      let uploaded: any = null;
      if (beforeSubmit) {
        uploaded = await beforeSubmit();
      }

      const arg = values.threads.map((value: any) => ({
        content: {
          text: value.text,
          contentType: uploaded ? "media" : "text",
          ...(uploaded ? { files: uploaded.map((file: any) => file.url) } : {}),
        },
      }));
      if (user?.userId) {
        setOpen(false);
        await message.open({
          type: "loading",
          content: "Posting...",
        });
        if (thread) {
          await createThreadService(arg, user?.userId, thread.id);
        } else {
          await createThreadService(arg, user?.userId);
        }
        setOpen(false);
        messageApi.destroy();
        await message.success("Posted");
        form.resetFields();
      }
    } catch (error) {
      console.log(error);
      form.resetFields();
      await message.error("Error when posting");
    }
  };

  return {
    currentValue,
    disableSubmit,
    form,
    isOpenConfirmDiscard,
    loading,
    onFinish,
    replyTo,
    setOpen,
    setOpenConfirmDiscard,
    thread,
    user,
  };
};
