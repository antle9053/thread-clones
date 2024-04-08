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
import { ThreadType } from "../components/CreateThreadForm";

interface UseThreadFormProps {
  afterSubmit?: () => void;
  beforeSubmit?: () => Promise<any>;
  gifs?: any[];
}

export const useCreateThreadForm = ({
  afterSubmit,
  beforeSubmit,
  gifs,
}: UseThreadFormProps) => {
  const [form] = Form.useForm();
  const [thread, setThread] = useState<GetReplyThreadResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpenConfirmDiscard, setOpenConfirmDiscard] =
    useState<boolean>(false);
  const [isOpenAddGif, setOpenAddGif] = useState<boolean>(false);
  const [threadTypes, setThreadTypes] = useState<ThreadType[]>(["text"]);

  const user = useAppStore(authSelectors.user);
  const setOpen = useAppStore(threadsSelectors.setOpenCreateThread);
  const replyTo = useAppStore(threadsSelectors.replyTo);
  const setReplyTo = useAppStore(threadsSelectors.setReplyTo);

  const threadsValue = Form.useWatch("threads", form);
  console.log(threadsValue);
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

  const resetForm = () => {
    form.resetFields();
    setReplyTo("");
    if (thread) setThread(null);
    setOpen(false);
    afterSubmit?.();
  };

  const onFinish = async (values: any) => {
    console.log(values);
    try {
      message.open({
        key: "message-loading",
        type: "loading",
        content: "Posting...",
        duration: 0,
      });
      let uploaded: any = null;
      if (beforeSubmit) {
        uploaded = await beforeSubmit();
      }

      const arg = values.threads.map((value: any, index: number) => ({
        content: {
          text: value.text ?? "",
          contentType: threadTypes[index],
          ...(threadTypes[index] === "media"
            ? {
                files: uploaded[index].map((file: any) => ({
                  url: file.url,
                  type: file.type,
                })),
              }
            : threadTypes[index] === "gif"
            ? {
                gif: gifs?.[index]?.id,
              }
            : {}),
        },
      }));

      if (user?.userId) {
        setOpen(false);

        if (thread) {
          await createThreadService(arg, user?.userId, thread.id);
        } else {
          await createThreadService(arg, user?.userId);
        }

        message.destroy("message-loading");
        await message.success("Posted");
      }
    } catch (error) {
      message.destroy("message-loading");
      console.log(error);
      await message.error("Error when posting");
    } finally {
      resetForm();
    }
  };

  return {
    currentValue,
    disableSubmit,
    form,
    isOpenAddGif,
    isOpenConfirmDiscard,
    loading,
    onFinish,
    replyTo,
    setOpen,
    setOpenAddGif,
    setOpenConfirmDiscard,
    setThreadTypes,
    resetForm,
    thread,
    threadTypes,
    threadsValueLength: threadsValue?.length ?? 0,
    user,
  };
};
