import { Button, Form, Input, Modal, Upload } from "antd";
import clsx from "clsx";
import {
  AlignLeft,
  Images,
  MoreHorizontal,
  StickyNote,
  Tag,
  X,
} from "lucide-react";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useCreateThreadForm } from "../hooks/useCreateThreadForm";
import moment from "moment";
import { Loading } from "@/src/shared/components/ui/Loading";
import { MediaPreviews } from "./MediaPreviews";
import { useUploadImages } from "../hooks/useUploadImages";

export type CreateThreadFormHandle = {
  handleOpenConfirm: () => void;
};

interface CreateThreadFormProps {}

export const CreateThreadForm = forwardRef<
  CreateThreadFormHandle,
  CreateThreadFormProps
>(({}, ref: any) => {
  const { fileList, handleChange, handleRemove, previews, uploadImages } =
    useUploadImages();

  const {
    currentValue,
    disableSubmit,
    form,
    isOpenConfirmDiscard,
    loading,
    onFinish,
    thread,
    setOpen,
    setOpenConfirmDiscard,
    user,
  } = useCreateThreadForm({
    ...(previews.length > 0 ? { beforeSubmit: uploadImages } : {}),
  });

  useImperativeHandle(ref, () => ({
    handleOpenConfirm: () => {
      if (!disableSubmit || previews.length > 0) setOpenConfirmDiscard(true);
      else setOpen(false);
    },
  }));

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
                    <div className="w-[1px] bg-slate-300 h-full"></div>
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
                    <div>
                      <span className="text-base">{thread.content?.text}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            <Form.List name="threads" initialValue={[{ text: "" }]}>
              {(fields, { add, remove }) => {
                return (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <div key={key} className="flex gap-3 mt-2 items-stretch">
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
                              <div onClick={() => remove(name)}>
                                <X size={16} color="#888888" strokeWidth={2} />
                              </div>
                            ) : null}
                          </div>

                          <Form.Item
                            {...restField}
                            className="mb-0"
                            name={[name, "text"]}
                          >
                            <Input.TextArea
                              autoSize
                              className="!border-0 !shadow-none p-0 text-base"
                              placeholder={
                                key === 0 ? "Start a thread" : "Say more..."
                              }
                              rows={1}
                            />
                          </Form.Item>
                          <div className="w-full mb-2">
                            <MediaPreviews
                              handleRemove={handleRemove}
                              previews={previews}
                            />
                          </div>
                          <div className="flex h-[36px]">
                            <div className="h-full w-[36px] flex items-center">
                              <Upload
                                multiple
                                showUploadList={false}
                                fileList={fileList}
                                onChange={handleChange}
                                className="!h-5"
                              >
                                <Images
                                  size={20}
                                  color="#999999"
                                  strokeWidth={1.5}
                                />
                              </Upload>
                            </div>
                            <div className="h-full w-[36px] flex items-center">
                              <StickyNote
                                size={20}
                                color="#999999"
                                strokeWidth={1.5}
                              />
                            </div>
                            <div className="h-full w-[36px] flex items-center">
                              <Tag
                                size={20}
                                color="#999999"
                                strokeWidth={1.5}
                              />
                            </div>
                            <div className="h-full w-[36px] flex items-center">
                              <AlignLeft
                                size={20}
                                color="#999999"
                                strokeWidth={1.5}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div
                      className={clsx(
                        "flex gap-3 mb-2 items-center",
                        currentValue ? "" : "opacity-30"
                      )}
                      onClick={() => {
                        if (currentValue) add();
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
              disabled={disableSubmit && previews.length === 0}
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
              form.resetFields();
              setOpen(false);
            }}
          >
            <span className="text-base font-[700] text-[#FF3040]">Discard</span>
          </div>
        </div>
      </Modal>
    </>
  );
});

CreateThreadForm.displayName = "CreateThreadForm";
