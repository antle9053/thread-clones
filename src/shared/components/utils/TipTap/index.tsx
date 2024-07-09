import { Editor, EditorContent } from "@tiptap/react";
import React, { FC } from "react";

interface TipTapProps {
  editor: Editor | null;
}

export const TipTap: FC<TipTapProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return <EditorContent editor={editor} />;
};
