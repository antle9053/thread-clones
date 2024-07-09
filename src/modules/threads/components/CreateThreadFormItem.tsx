import { FormInstance, Upload, UploadFile } from "antd";
import { AlignLeft, Images, StickyNote, X } from "lucide-react";
import { FC, useEffect } from "react";
import { MediaPreviews } from "./MediaPreviews";
import { Preview } from "../hooks/useUploadImages";
import { Gif } from "@giphy/react-components";
import { useWindowSize } from "usehooks-ts";
import { TipTap } from "@/src/shared/components/utils/TipTap";
import { Tags } from "./Toolbar/Tags";
import { Poll } from "./Poll";
import { Quote } from "./Quote";
import Image from "next/image";
import { User } from "@/src/shared/infra/zustand/slices/authSlice";
import { ThreadType } from "./CreateThreadForm";
import { useTipTap } from "@/src/shared/components/utils/TipTap/hooks/useTipTap";
import { useAppStore } from "@/src/shared/infra/zustand";
import { threadsSelectors } from "../zustand/threadsSlice";

interface CreateThreadFormItemProps {
  beforeUpload: (file: any) => boolean;
  changeThreadType: (key: number, type: ThreadType) => void;
  fileList: UploadFile<any>[];
  form: FormInstance<any>;
  gifs: any;
  handleChange: any;
  handleRemove: (uid: string, key: number) => true | undefined;
  handleRemoveRow: (key: number) => void;
  name: number;
  preview: Preview[];
  setGifs: (gif: any) => void;
  setOpenGifAt: (key: number) => void;
  setOpenGif: (open: boolean) => void;
  threadType: ThreadType;
  user: User;
}

export const CreateThreadFormItem: FC<CreateThreadFormItemProps> = ({
  beforeUpload,
  changeThreadType,
  fileList,
  form,
  gifs,
  handleChange,
  handleRemove,
  handleRemoveRow,
  name: key,
  preview,
  setGifs,
  setOpenGif,
  setOpenGifAt,
  threadType,
  user,
}) => {
  const { width = 0 } = useWindowSize();

  const gifWidth = width > 600 ? 492 : width - 108;

  const onChange = (value: string) => {
    const { threads } = form.getFieldsValue();
    Object.assign(threads[key], { text: value });
    form.setFieldsValue({ threads });
  };

  const mention = useAppStore(threadsSelectors.mention);

  const { editor } = useTipTap({
    name: key,
    onChange,
  });

  useEffect(() => {
    if (editor && mention && key === 0) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: "mention",
          attrs: {
            id: mention,
          },
        })
        .insertContent(" ")
        .run();
    }
  }, [editor, mention, key]);

  return (
    <div className="flex gap-3 items-stretch">
      <div className="basis-[48px] grow-0 flex flex-col">
        <Image
          alt="User Avatar"
          width={48}
          height={48}
          className="rounded-full"
          src={user?.avatar || ""}
        />
        <div className="grow flex justify-center my-2">
          <div className="w-[1px] bg-slate-300 h-full"></div>
        </div>
      </div>
      <div className="basis-0 grow">
        <div className="w-full flex justify-between">
          <p className="font-bold text-base">{user?.username}</p>
          {key !== 0 ? (
            <div
              onClick={() => {
                const { threads } = form.getFieldsValue();
                Object.assign(threads[key], {
                  text: undefined,
                  poll: [],
                });
                form.setFieldsValue({ threads });
                handleRemoveRow(key);
                changeThreadType(key, "text");
                setGifs((gifs: any) =>
                  gifs.map((gif: any, index: number) =>
                    index === key ? null : gif
                  )
                );
              }}
            >
              <X size={16} color="#888888" strokeWidth={2} />
            </div>
          ) : null}
        </div>
        <div className="mb-1">
          <TipTap editor={editor} />
        </div>
        <div className="mb-1">
          {threadType === "poll" ? (
            <Poll
              form={form}
              name={key}
              onRemove={() => changeThreadType(key, "text")}
            />
          ) : null}
        </div>
        <div className="w-full">
          {threadType === "media" ? (
            <MediaPreviews
              handleRemove={(uid) => {
                const isClear = handleRemove(uid, key);
                if (isClear) {
                  changeThreadType(key, "text");
                }
              }}
              previews={preview}
            />
          ) : threadType === "gif" ? (
            <div className="relative w-full mb-2">
              <div
                className="absolute top-2 right-2 w-8 h-8 bg-black/40 rounded-full flex justify-center items-center z-[99]"
                onClick={() => {
                  setGifs((gifs: any) =>
                    gifs.map((gif: any, index: number) =>
                      index === key ? null : gif
                    )
                  );
                  changeThreadType(key, "text");
                }}
              >
                <X strokeWidth={2} color="white" />
              </div>
              <Gif borderRadius={12} gif={gifs[key]} noLink width={gifWidth} />
            </div>
          ) : null}
        </div>
        {threadType === "gif" || threadType === "poll" ? null : (
          <div className="flex h-[36px] -ml-2">
            <div className="h-full w-[36px] flex items-center justify-center">
              <Upload
                beforeUpload={beforeUpload}
                id={`upload-${key}`}
                multiple
                showUploadList={false}
                fileList={fileList}
                onChange={(info) => {
                  const isChanged = handleChange(info, key);
                  if (isChanged) {
                    changeThreadType(key, "media");
                  }
                }}
                className="!h-5"
                maxCount={5}
              >
                <Images size={20} color="#666666" strokeWidth={2} />
              </Upload>
            </div>

            {threadType !== "media" ? (
              <div
                className="h-full w-[36px] flex items-center justify-center"
                onClick={() => {
                  setOpenGifAt(key);
                  setOpenGif(true);
                }}
              >
                <StickyNote size={20} color="#666666" strokeWidth={2} />
              </div>
            ) : null}
            <Tags userId={user?.id as string} editor={editor} />
            {threadType !== "media" ? (
              <div
                className="h-full w-[36px] flex items-center justify-center"
                onClick={() => changeThreadType(key, "poll")}
              >
                <AlignLeft size={20} color="#666666" strokeWidth={2} />
              </div>
            ) : null}
          </div>
        )}
        <Quote type="create" />
      </div>
    </div>
  );
};
