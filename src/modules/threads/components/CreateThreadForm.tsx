import { Button, Dropdown, Form, Modal, Upload } from "antd";
import clsx from "clsx";
import {
  AlignLeft,
  Images,
  MoreHorizontal,
  StickyNote,
  Tag,
  X,
} from "lucide-react";
import { forwardRef, useImperativeHandle } from "react";
import { useCreateThreadForm } from "../hooks/useCreateThreadForm";
import moment from "moment";
import { Loading } from "@/src/shared/components/ui/Loading";
import { MediaPreviews } from "./MediaPreviews";
import { useUploadImages } from "../hooks/useUploadImages";
import { AddGif } from "./AddGif";
import { useGif } from "../hooks/useGif";
import { Gif } from "@giphy/react-components";
import { useWindowSize } from "usehooks-ts";
import { TipTap } from "@/src/shared/components/utils/TipTap";
import { Tags } from "./Toolbar/Tags";
import { Render } from "../../home/components/Render";

export type ThreadType = "text" | "media" | "gif" | "poll";

export type CreateThreadFormHandle = {
  handleOpenConfirm: () => void;
};

interface CreateThreadFormProps {}

export const CreateThreadForm = forwardRef<
  CreateThreadFormHandle,
  CreateThreadFormProps
>(({}, ref: any) => {
  const {
    beforeUpload,
    fileList,
    handleChange,
    handleClear,
    handleRemove,
    handleRemoveRow,
    previews,
    uploadImages,
  } = useUploadImages();

  const {
    isOpenGif,
    gifs,
    openGifAt,
    removeAllGifs,
    setGifs,
    setOpenGif,
    setOpenGifAt,
  } = useGif();

  const {
    currentValue,
    disableSubmit,
    form,
    isOpenConfirmDiscard,
    loading,
    onFinish,
    setOpenConfirmDiscard,
    setThreadTypes,
    thread,
    threadTypes,
    threadsValueLength,
    resetForm,
    user,
  } = useCreateThreadForm({
    ...(previews.flat().length > 0
      ? {
          beforeSubmit: uploadImages,
          afterSubmit: handleClear,
        }
      : {}),
    gifs,
    removeAllGifs,
  });

  useImperativeHandle(ref, () => ({
    handleOpenConfirm: () => {
      if (!disableSubmit || previews.length > 0) {
        setOpenConfirmDiscard(true);
      } else {
        resetForm();
      }
    },
  }));

  const { width = 0 } = useWindowSize();

  const gifWidth = width > 600 ? 492 : width - 108;

  if (loading) return <Loading />;

  return (
    <>
      <div className="w-full h-full" ref={ref}>
        <Form
          autoComplete="off"
          className="h-full"
          form={form}
          onFinish={onFinish}
        >
          <div className="max-h-[calc(100vh_-_72px)] overflow-scroll px-6 pb-[72px]">
            {thread ? (
              <div className="flex gap-3 mt-2 items-stretch">
                <div className="basis-[48px] grow-0 flex flex-col">
                  <img
                    src={thread.author?.avatar || ""}
                    className="w-[48px] h-[48px] rounded-full"
                  />
                  <div className="grow flex justify-center my-2">
                    <div className="w-[1px] bg-slate-300 h-full min-h-[10px]"></div>
                  </div>
                </div>
                <div className="grow">
                  <div className="w-full flex justify-between">
                    <span className="font-bold text-base">
                      {thread.author?.username}
                    </span>
                    <div className="flex gap-2">
                      <span className="text-[#666666]">
                        {moment().fromNow()}
                      </span>
                      <div className="text-black/50">
                        <MoreHorizontal />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Render content={thread.content?.text ?? ""} />
                  </div>
                </div>
              </div>
            ) : null}
            <Form.List name="threads" initialValue={[{ text: "" }]}>
              {(fields, { add, remove }) => {
                return (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <div key={key} className="flex gap-3 items-stretch">
                        <div className="basis-[48px] grow-0 flex flex-col">
                          <img
                            src={user?.avatar || ""}
                            className="w-[48px] h-[48px] rounded-full"
                          />
                          <div className="grow flex justify-center my-2">
                            <div className="w-[1px] bg-slate-300 h-full"></div>
                          </div>
                        </div>
                        <div className="basis-0 grow">
                          <div className="w-full flex justify-between">
                            <p className="font-bold text-base">
                              {user?.username}
                            </p>
                            {key !== 0 ? (
                              <div
                                onClick={() => {
                                  handleRemoveRow(name);
                                  remove(name);
                                  setThreadTypes((threadTypes) => {
                                    const newThreadTypes = [...threadTypes];
                                    newThreadTypes[name] = "text";
                                    return newThreadTypes;
                                  });
                                  setGifs((gifs) =>
                                    gifs.filter((gif, index) =>
                                      index === name ? null : gif
                                    )
                                  );
                                }}
                              >
                                <X size={16} color="#888888" strokeWidth={2} />
                              </div>
                            ) : null}
                          </div>
                          <Form.Item
                            {...restField}
                            className="mb-0"
                            name={[name, "text"]}
                          >
                            <TipTap
                              name={name}
                              onChange={(value: string) => {
                                const { threads } = form.getFieldsValue();
                                Object.assign(threads[name], { text: value });
                                form.setFieldsValue({ threads });
                              }}
                            />
                          </Form.Item>
                          <div className="w-full">
                            {threadTypes[name] === "media" ? (
                              <MediaPreviews
                                handleRemove={(uid) => {
                                  const isClear = handleRemove(uid, name);
                                  if (isClear) {
                                    setThreadTypes((threadTypes) => {
                                      const newThreadTypes = [...threadTypes];
                                      newThreadTypes[name] = "text";
                                      return newThreadTypes;
                                    });
                                  }
                                }}
                                previews={previews[name]}
                              />
                            ) : threadTypes[name] === "gif" ? (
                              <div className="relative w-full mb-2">
                                <div
                                  className="absolute top-2 right-2 w-8 h-8 bg-black/40 rounded-full flex justify-center items-center z-[99]"
                                  onClick={() => {
                                    setGifs((gifs) =>
                                      gifs.filter((gif, index) =>
                                        index === name ? null : gif
                                      )
                                    );
                                    setThreadTypes((threadTypes) => {
                                      const newThreadTypes = [...threadTypes];
                                      newThreadTypes[name] = "text";
                                      return newThreadTypes;
                                    });
                                  }}
                                >
                                  <X strokeWidth={2} color="white" />
                                </div>
                                <Gif
                                  borderRadius={12}
                                  gif={gifs[name]}
                                  width={gifWidth}
                                  noLink
                                />
                              </div>
                            ) : null}
                          </div>
                          {threadTypes[name] === "gif" ||
                          threadTypes[name] === "poll" ? null : (
                            <div className="flex h-[36px] -ml-2">
                              <div className="h-full w-[36px] flex items-center justify-center">
                                <Upload
                                  {...restField}
                                  beforeUpload={beforeUpload}
                                  id={`upload-${name}`}
                                  multiple
                                  showUploadList={false}
                                  fileList={fileList[name]}
                                  onChange={(info) => {
                                    const isChanged = handleChange(info, name);
                                    if (isChanged) {
                                      setThreadTypes((threadTypes) => {
                                        const newThreadTypes = [...threadTypes];
                                        newThreadTypes[name] = "media";
                                        return newThreadTypes;
                                      });
                                    }
                                  }}
                                  className="!h-5"
                                  maxCount={5}
                                >
                                  <Images
                                    size={20}
                                    color="#666666"
                                    strokeWidth={2}
                                  />
                                </Upload>
                              </div>
                              {threadTypes[name] !== "media" ? (
                                <div
                                  className="h-full w-[36px] flex items-center justify-center"
                                  onClick={() => {
                                    setOpenGifAt(name);
                                    setOpenGif(true);
                                  }}
                                >
                                  <StickyNote
                                    size={20}
                                    color="#666666"
                                    strokeWidth={2}
                                  />
                                </div>
                              ) : null}
                              <Tags
                                userId={user?.id as string}
                                name={name}
                                onChange={(value: string) => {
                                  const { threads } = form.getFieldsValue();
                                  Object.assign(threads[name], { text: value });
                                  form.setFieldsValue({ threads });
                                }}
                              />
                              {threadTypes[name] !== "media" ? (
                                <div className="h-full w-[36px] flex items-center justify-center">
                                  <AlignLeft
                                    size={20}
                                    color="#666666"
                                    strokeWidth={2}
                                  />
                                </div>
                              ) : null}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div
                      className={clsx(
                        "flex gap-3 mb-2 items-center",
                        currentValue ||
                          previews?.[threadsValueLength - 1]?.length > 0 ||
                          gifs[threadsValueLength - 1]
                          ? ""
                          : "opacity-30"
                      )}
                      onClick={() => {
                        if (
                          currentValue ||
                          previews?.[threadsValueLength - 1]?.length > 0 ||
                          gifs[threadsValueLength - 1]
                        )
                          add();
                      }}
                    >
                      <div className="basis-[48px] grow-0 flex justify-center ">
                        <img
                          src={user?.avatar || ""}
                          className="w-[36px] h-[36px] rounded-full"
                        />
                      </div>
                      <span className="text-slate-300 text-[14px]">
                        Add to thread
                      </span>
                    </div>
                  </>
                );
              }}
            </Form.List>
          </div>
          <Form.Item className="px-6 py-5 mb-0 backdrop-blur-xl w-full absolute bottom-0 left-0">
            <Button
              type="primary"
              htmlType="submit"
              className="bg-primary float-right"
              disabled={
                disableSubmit && previews.length === 0 && gifs.length === 0
              }
            >
              Post
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Modal
        className="discard-create-thread-modal"
        open={isOpenConfirmDiscard}
        closeIcon={null}
        footer={[]}
        centered
      >
        <div className="border-b h-3/5 w-full border-solid border-slate-300 flex justify-center items-center">
          <span className="text-base font-[700] text-[#333333]">
            Discard thread?
          </span>
        </div>
        <div className="flex absolute h-2/5 w-full bottom-0 left-0">
          <div
            className="w-1/2 h-full border-r border-solid border-slate-300 text-base flex justify-center items-center"
            onClick={() => {
              setOpenConfirmDiscard(false);
            }}
          >
            <span className="text-base font-[400] text-[#333333]">Cancel</span>
          </div>
          <div
            className="w-1/2 h-full flex justify-center items-center"
            onClick={() => {
              setOpenConfirmDiscard(false);
              resetForm();
            }}
          >
            <span className="text-base font-[700] text-[#FF3040]">Discard</span>
          </div>
        </div>
      </Modal>
      <AddGif
        isOpenGif={isOpenGif}
        openGifAt={openGifAt}
        setGifs={setGifs}
        setOpenGifAt={setOpenGifAt}
        setOpenGif={setOpenGif}
        afterSelectGif={setThreadTypes}
      />
    </>
  );
});

CreateThreadForm.displayName = "CreateThreadForm";
