import { useCallback, useEffect, useState } from "react";
import { useAppStore } from "@/src/shared/infra/zustand";
import { authSelectors } from "@/src/shared/infra/zustand/slices/authSlice";
import { Form, message } from "antd";
import { threadsSelectors } from "../zustand/threadsSlice";
import {
  CreateThreadArg,
  GetReplyThreadResponse,
  createThreadService,
  getThreadService,
} from "@/src/shared/services/thread.service";
import { ThreadType } from "../components/CreateThreadForm";
import { addTags } from "@/src/shared/services/tags.service";

interface UseThreadFormProps {
  afterSubmit?: () => void;
  beforeSubmit?: () => Promise<any>;
  gifs?: any[];

  removeAllGifs: () => void;
}

export const useCreateThreadForm = ({
  afterSubmit,
  beforeSubmit,
  gifs,
  removeAllGifs,
}: UseThreadFormProps) => {
  const [form] = Form.useForm();
  const [thread, setThread] = useState<GetReplyThreadResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpenConfirmDiscard, setOpenConfirmDiscard] =
    useState<boolean>(false);
  const [threadTypes, setThreadTypes] = useState<ThreadType[]>(["text"]);

  const user = useAppStore(authSelectors.user);
  const setOpen = useAppStore(threadsSelectors.setOpenCreateThread);
  const replyTo = useAppStore(threadsSelectors.replyTo);
  const setReplyTo = useAppStore(threadsSelectors.setReplyTo);
  const quote = useAppStore(threadsSelectors.quote);

  const threadsValue = Form.useWatch("threads", form);

  const isSomeValueEmpty = threadsValue?.some(
    (thread: any) => thread?.text === ""
  );

  const reverseIndex = [...(threadsValue ?? [])]
    ?.reverse()
    .findIndex((item) => item.text !== undefined);
  const latestIndex =
    [...(threadsValue ?? [])]?.reverse().slice(reverseIndex).reverse().length -
    1;
  const currentValue = threadsValue?.[latestIndex]?.text;

  const isPollValid = useCallback(
    (index: number) => {
      return (
        threadTypes?.[index] === "poll" &&
        threadsValue?.[index]?.poll?.[0].option &&
        threadsValue?.[index]?.poll?.[1].option
      );
    },
    [threadTypes, threadsValue]
  );

  const isCurrentPollValid = isPollValid(latestIndex);
  const allPollValid = Array.from(
    { length: threadsValue?.length },
    (_, i) => i
  ).every(isPollValid);

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
    setThreadTypes(["text"]);
    removeAllGifs?.();
    afterSubmit?.();
  };

  const changeThreadType = (key: number, type: ThreadType) => {
    setThreadTypes((threadTypes) => {
      const newThreadTypes = [...threadTypes];
      newThreadTypes[key] = type;
      return newThreadTypes;
    });
  };

  const onFinish = async (values: any) => {
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

      const parser = new DOMParser();
      const listTags: string[] = [];
      const listMentions: string[] = [];

      const arg: CreateThreadArg[] = values.threads
        .filter((value: any) => value.text !== undefined)
        .map((value: any, index: number) => {
          const doc = parser.parseFromString(value.text, "text/html");
          const tagNodes = doc.querySelectorAll("[data-type='hashtag']");
          const tags = Array.from(tagNodes).map((node) => ({
            title: node.getAttribute("data-id"),
          }));
          listTags.push(...tags.map((tag) => tag.title ?? ""));

          const mentionNodes = doc.querySelectorAll("[data-type='mention']");
          const mentions = Array.from(mentionNodes).map((node) => ({
            title: node.getAttribute("data-id"),
          }));
          listMentions.push(...mentions.map((tag) => tag.title ?? ""));

          return {
            ...(quote ? { quoteId: quote.id } : {}),
            content: {
              text: value.text ?? "",
              tags,
              contentType:
                value?.poll?.filter((item: any) => item.option).length === 0 ||
                value?.poll?.filter((item: any) => item.option).length === 1
                  ? "text"
                  : threadTypes[index] ?? "text",
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
                : threadTypes[index] === "poll" &&
                  value?.poll?.filter((item: any) => item.option).length > 1
                ? {
                    poll: {
                      options: value.poll
                        .filter((item: any) => item.option !== "")
                        .map((item: any) => ({
                          text: item.option,
                        })),
                    },
                  }
                : {}),
            },
          };
        });

      if (user?.userId) {
        setOpen(false);

        if (thread) {
          await createThreadService(arg, user?.userId, thread.id);
        } else {
          await createThreadService(arg, user?.userId);
        }

        await addTags(user?.id, listTags);

        message.destroy("message-loading");
        await message.success("Posted");
      }
    } catch (error) {
      message.destroy("message-loading");
      await message.error("Error when posting");
    } finally {
      resetForm();
      location.reload();
    }
  };

  return {
    allPollValid,
    changeThreadType,
    currentValue,
    isSomeValueEmpty,
    form,
    isCurrentPollValid,
    isOpenConfirmDiscard,
    latestIndex,
    loading,
    onFinish,
    replyTo,
    setOpen,
    setOpenConfirmDiscard,
    setThreadTypes,
    resetForm,
    thread,
    threadTypes,
    user,
  };
};
