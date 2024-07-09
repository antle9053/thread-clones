import {
  GetTagsResponse,
  getUsedTagsService,
} from "@/src/shared/services/tags.service";
import { Editor } from "@tiptap/react";
import { Dropdown, message } from "antd";
import { Tag } from "lucide-react";
import { FC, useEffect, useState } from "react";

interface TagsProps {
  editor: Editor | null;
  userId: string;
}

export const Tags: FC<TagsProps> = ({ editor, userId }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [usedTags, setUsedTags] = useState<GetTagsResponse[]>([]);

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
                    if (editor) {
                      editor
                        .chain()
                        .focus()
                        .insertContent({
                          type: "hashtag",
                          attrs: {
                            id: tag.title,
                          },
                        })
                        .insertContent(" ")
                        .run();
                    }
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
