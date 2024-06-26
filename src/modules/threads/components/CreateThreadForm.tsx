import { Button, Form, Modal, Upload } from "antd";
import clsx from "clsx";
import { AlignLeft, Images, MoreHorizontal, StickyNote, X } from "lucide-react";
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
import { Poll } from "./Poll";
import { Quote } from "./Quote";
import Image from "next/image";

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
    handleAddRow,
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
    setOpenConfirmDiscard,
    setThreadTypes,
    thread,
    threadTypes,
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

  const disableAdd =
    currentValue === "" &&
    previews?.[latestIndex]?.length === 0 &&
    !gifs?.[latestIndex] &&
    !isCurrentPollValid;

  const disableSubmit =
    isSomeValueEmpty &&
    previews.flat(1).length === 0 &&
    gifs.length === 0 &&
    !allPollValid;

  useImperativeHandle(ref, () => ({
    handleOpenConfirm: () => {
      if (!disableSubmit) {
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
                  <Image
                    alt="Author Avatar"
                    width={48}
                    height={48}
                    className="rounded-full"
                    src={thread.author?.avatar || ""}
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
                        {moment(thread.createdAt).fromNow()}
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
              {(fields, { add }) => {
                return (
                  <>
                    {fields.map(({ key, name }) => {
                      const { threads } = form.getFieldsValue();
                      if (!threads) return null;
                      if (threads[key].text === undefined) return null;
                      return (
                        <div key={key} className="flex gap-3 items-stretch">
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
                              <p className="font-bold text-base">
                                {user?.username}
                              </p>
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
                                    setGifs((gifs) =>
                                      gifs.map((gif, index) =>
                                        index === key ? null : gif
                                      )
                                    );
                                  }}
                                >
                                  <X
                                    size={16}
                                    color="#888888"
                                    strokeWidth={2}
                                  />
                                </div>
                              ) : null}
                            </div>
                            <div className="mb-1">
                              <TipTap
                                name={key}
                                onChange={(value: string) => {
                                  const { threads } = form.getFieldsValue();
                                  Object.assign(threads[key], { text: value });
                                  form.setFieldsValue({ threads });
                                }}
                              />
                            </div>
                            <div className="mb-1">
                              {threadTypes[key] === "poll" ? (
                                <Poll
                                  form={form}
                                  name={key}
                                  onRemove={() => changeThreadType(key, "text")}
                                />
                              ) : null}
                            </div>
                            <div className="w-full">
                              {threadTypes[key] === "media" ? (
                                <MediaPreviews
                                  handleRemove={(uid) => {
                                    const isClear = handleRemove(uid, key);
                                    if (isClear) {
                                      changeThreadType(key, "text");
                                    }
                                  }}
                                  previews={previews[key]}
                                />
                              ) : threadTypes[key] === "gif" ? (
                                <div className="relative w-full mb-2">
                                  <div
                                    className="absolute top-2 right-2 w-8 h-8 bg-black/40 rounded-full flex justify-center items-center z-[99]"
                                    onClick={() => {
                                      setGifs((gifs) =>
                                        gifs.map((gif, index) =>
                                          index === name ? null : gif
                                        )
                                      );
                                      changeThreadType(key, "text");
                                    }}
                                  >
                                    <X strokeWidth={2} color="white" />
                                  </div>
                                  <Gif
                                    borderRadius={12}
                                    gif={gifs[key]}
                                    noLink
                                    width={gifWidth}
                                  />
                                </div>
                              ) : null}
                            </div>
                            {threadTypes[key] === "gif" ||
                            threadTypes[key] === "poll" ? null : (
                              <div className="flex h-[36px] -ml-2">
                                <div className="h-full w-[36px] flex items-center justify-center">
                                  <Upload
                                    beforeUpload={beforeUpload}
                                    id={`upload-${key}`}
                                    multiple
                                    showUploadList={false}
                                    fileList={fileList[key]}
                                    onChange={(info) => {
                                      const isChanged = handleChange(info, key);
                                      if (isChanged) {
                                        changeThreadType(key, "media");
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
                                    Object.assign(threads[name], {
                                      text: value,
                                    });
                                    form.setFieldsValue({ threads });
                                  }}
                                />
                                {threadTypes[name] !== "media" ? (
                                  <div
                                    className="h-full w-[36px] flex items-center justify-center"
                                    onClick={() =>
                                      changeThreadType(key, "poll")
                                    }
                                  >
                                    <AlignLeft
                                      size={20}
                                      color="#666666"
                                      strokeWidth={2}
                                    />
                                  </div>
                                ) : null}
                              </div>
                            )}
                            <Quote type="create" />
                          </div>
                        </div>
                      );
                    })}
                    <div
                      className={clsx(
                        "flex gap-3 mb-2 items-center",
                        !disableAdd ? "" : "opacity-30"
                      )}
                      onClick={() => {
                        if (!disableAdd) {
                          add({ text: "" });
                          handleAddRow();
                          setThreadTypes((threadTypes) => [
                            ...threadTypes,
                            "text",
                          ]);
                        }
                      }}
                    >
                      <div className="basis-[48px] grow-0 flex justify-center ">
                        <Image
                          alt="User Avatar"
                          width={36}
                          height={36}
                          className="rounded-full"
                          src={user?.avatar || ""}
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
              disabled={disableSubmit}
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
              handleClear();
              form.setFieldsValue({
                threads: [{ text: "" }],
              });
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
