import { Modal } from "antd";
import { FC } from "react";

interface ConfirmDeleteThreadProps {
  open: boolean;
  handleClose: () => void;
  handleDelete: () => void;
}

export const ConfirmDeleteThread: FC<ConfirmDeleteThreadProps> = ({
  open,
  handleClose,
  handleDelete,
}) => {
  return (
    <Modal
      className="confirm-delete-thread-modal"
      open={open}
      closeIcon={null}
      footer={[]}
      centered
    >
      <div className="border-b h-2/3 w-full border-solid border-slate-300 flex flex-col justify-center items-center">
        <span className="text-base font-[700] text-[#333333]">
          Delete post ?
        </span>
        <span className="text-center text-base text-[#999999]">
          If you delete this post, you won&#39;t be able to restore it.
        </span>
      </div>
      <div className="flex absolute h-1/3 w-full bottom-0 left-0">
        <div
          className="w-1/2 h-full border-r border-solid border-slate-300 text-base flex justify-center items-center"
          onClick={() => {
            handleClose();
          }}
        >
          <span className="text-base font-[400] text-[#333333]">Cancel</span>
        </div>
        <div
          className="w-1/2 h-full flex justify-center items-center"
          onClick={() => {
            handleClose();
            handleDelete();
          }}
        >
          <span className="text-base font-[700] text-[#FF3040]">Delete</span>
        </div>
      </div>
    </Modal>
  );
};
