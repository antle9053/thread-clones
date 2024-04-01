import { useAppStore } from "@/src/shared/infra/zustand";
import { authSelectors } from "@/src/shared/infra/zustand/slices/authSlice";
import { createThreadService } from "@/src/shared/services/thread.service";
import { Button, Form, Input, Modal, message } from "antd";
import clsx from "clsx";
import { AlignLeft, Images, StickyNote, Tag, X } from "lucide-react";
import { forwardRef, useImperativeHandle, useState } from "react";
import { threadsSelectors } from "../../zustand/threadsSlice";

export type CreateThreadFormHandle = {
  handleOpenConfirm: () => void;
};

export const CreateThreadForm = forwardRef<CreateThreadFormHandle, {}>(
  ({}, ref: any) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const user = useAppStore(authSelectors.user);
    const setOpen = useAppStore(threadsSelectors.setOpenCreateThread);
    const [isOpenConfirmDiscard, setOpenConfirmDiscard] =
      useState<boolean>(false);

    const threadsValue = Form.useWatch("threads", form);

    const currentValue = threadsValue?.[threadsValue.length - 1]?.text;
    const disableSubmit = threadsValue?.some(
      (thread: any) => thread?.text === "" || thread === undefined
    );

    const onFinish = async (values: any) => {
      try {
        const arg = values.threads.map((value: any) => ({
          content: {
            text: value.text,
          },
        }));
        if (user?.userId) {
          setOpen(false);
          await message.open({
            type: "loading",
            content: "Posting...",
          });
          await createThreadService(arg, user?.userId);
          setOpen(false);
          await message.success("Posted");
          form.resetFields();
        }
      } catch (error) {
        await message.error("Error when posting");
      }
    };

    useImperativeHandle(ref, () => ({
      handleOpenConfirm: () => {
        if (!disableSubmit) setOpenConfirmDiscard(true);
        else setOpen(false);
      },
    }));

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
              <Form.List name="threads" initialValue={[{ text: "" }]}>
                {(fields, { add, remove }) => {
                  return (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <div
                          key={key}
                          className="flex gap-3 mt-2 items-stretch"
                        >
                          <div className="basis-[48px] grow-0 flex flex-col">
                            <img
                              src={user?.avatar || ""}
                              className="w-[48px] h-[48px] rounded-full"
                            />
                            <div className="grow flex justify-center my-2">
                              <div className="w-[1px] bg-slate-300 h-full"></div>
                            </div>
                          </div>
                          <div className="grow">
                            <div className="w-full flex justify-between">
                              <p className="font-bold text-base">
                                {user?.username}
                              </p>
                              {key !== 0 ? (
                                <div onClick={() => remove(name)}>
                                  <X
                                    size={16}
                                    color="#888888"
                                    strokeWidth={2}
                                  />
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
                            <div className="flex h-[36px]">
                              <div className="h-full w-[36px] flex items-center">
                                <Images
                                  size={20}
                                  color="#999999"
                                  strokeWidth={1.5}
                                />
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
              <span className="text-base font-[400] text-[#333333]">
                Cancel
              </span>
            </div>
            <div
              className="w-1/2 h-full flex justify-center items-center"
              onClick={() => {
                setOpenConfirmDiscard(false);
                form.resetFields();
                setOpen(false);
              }}
            >
              <span className="text-base font-[700] text-[#FF3040]">
                Discard
              </span>
            </div>
          </div>
        </Modal>
      </>
    );
  }
);

CreateThreadForm.displayName = "CreateThreadForm";
