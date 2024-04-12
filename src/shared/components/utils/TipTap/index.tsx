import { EditorContent } from "@tiptap/react";
import React, { FC } from "react";
import { useTipTap } from "./hooks/useTIpTap";

interface TipTapProps {
  name: number;
  onChange: any;
}

export const TipTap: FC<TipTapProps> = ({ name, onChange }) => {
  const { editor } = useTipTap({ name, onChange });

  if (!editor) {
    return null;
  }

  return <EditorContent editor={editor} />;
};
