import { useTipTap } from "@/src/shared/components/utils/TipTap/hooks/useTipTap";
import {
  GetTagsResponse,
  getUsedTagsService,
} from "@/src/shared/services/tags.service";
import { Dropdown, message } from "antd";
import { Tag } from "lucide-react";
import { FC, useEffect, useState } from "react";

interface TagsProps {
  userId: string;
  name: number;
  onChange: any;
}

export const Tags: FC<TagsProps> = ({ userId, name, onChange }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [usedTags, setUsedTags] = useState<GetTagsResponse[]>([]);

  const { editor } = useTipTap({ name, onChange });

  useEffect(() => {
    const init = async () => {
      if (userId) {
        try {
          const result = await getUsedTagsService(userId);
          setUsedTags(result);
        } catch (error) {
          message.error("Error");
        }
      }
    };
    init();
  }, []);

  return (
    <div
      className="h-full w-[36px] flex items-center justify-center"
      onClick={() => setOpen((open) => !open)}
    >
      {usedTags.length === 0 ? (
        <Tag size={20} color="#666666" strokeWidth={2} />
      ) : (
        <Dropdown
          menu={{
            items: usedTags.map((tag, index) => ({
              key: index,
              label: (
                <div
                  onClick={() => {
                    // if (editor) {
                    //   editor
                    //     .chain()
                    //     .focus()
                    //     .insertContent({
                    //       type: "mention",
                    //       attrs: {
                    //         id: tag.title,
                    //       },
                    //     })
                    //     .insertContent(" ")
                    //     .run();
                    // }
                    // insertMention?.(tag.title);
                  }}
                >
                  {tag.title}
                </div>
              ),
            })),
          }}
          open={open}
        >
          <Tag size={20} color="#666666" strokeWidth={2} />
        </Dropdown>
      )}
    </div>
  );
};
