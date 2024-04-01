import { Modal } from "antd";
import { FC, useRef } from "react";
import {
  CreateThreadForm,
  CreateThreadFormHandle,
} from "./components/Form/CreateThreadForm";
import { useAppStore } from "@/src/shared/infra/zustand";
import { threadsSelectors } from "./zustand/threadsSlice";

export const CreateThread: FC = () => {
  const isOpen = useAppStore(threadsSelectors.isOpenCreateThread);

  const formRef = useRef<CreateThreadFormHandle>(null);

  return (
    <Modal
      className="create-thread-modal"
      closeIcon={null}
      open={isOpen}
      footer={[]}
    >
      <div className="w-full flex justify-between items-center mb-6 pt-5 px-6">
        <span
          onClick={() => {
            if (formRef.current) {
              formRef.current?.handleOpenConfirm();
            }
          }}
          className="w-[50px] text-base text-[#666666]"
        >
          Cancel
        </span>
        <span className="text-base text-[#333333] font-bold">New thread</span>
        <span className="w-[50px]"></span>
      </div>
      <CreateThreadForm ref={formRef} />
    </Modal>
  );
};
