import { Input, Modal } from "antd";
import { FC, useEffect, useState } from "react";
import { useWindowSize } from "usehooks-ts";
import { Grid } from "@giphy/react-components";
import { fetchGifs, searchGifs } from "@/src/shared/infra/giphy";
import { Search } from "lucide-react";
import { Loading } from "@/src/shared/components/ui/Loading";

interface AddGifProps {
  isOpen: boolean;
  setOpen: (_isOpen: boolean) => void;
}

export const AddGif: FC<AddGifProps> = ({ isOpen, setOpen }) => {
  const [keyword, setKeyword] = useState<string>("");
  const { width = 0 } = useWindowSize();

  const gridWidth = width > 600 ? 568 : width - 32;

  return (
    <Modal className="add-gif-modal" closeIcon={null} open={isOpen} footer={[]}>
      <div className="w-full flex justify-between items-center mb-6 pt-5 px-6">
        <span
          onClick={() => {
            setOpen(false);
          }}
          className="w-[50px] text-base text-[#666666]"
        >
          Cancel
        </span>
        <span className="text-base text-[#333333] font-bold">Choose a GIF</span>
        <span className="w-[50px]"></span>
      </div>
      <div className="w-full p-4">
        <Input
          prefix={
            <div className="mr-1">
              <Search color="#666666" size={16} strokeWidth={2} />
            </div>
          }
          className="mb-4"
          placeholder="Search GIPHY"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
          size="large"
          variant="filled"
        />
        <Grid
          key={`gif-${keyword}`}
          columns={2}
          width={gridWidth}
          hideAttribution
          noLink
          fetchGifs={async (offset: number) => {
            if (keyword) {
              return await searchGifs(offset, keyword);
            }
            return await fetchGifs(offset);
          }}
          onGifClick={(gif) => {
            console.log(gif);
          }}
        />
      </div>
    </Modal>
  );
};
