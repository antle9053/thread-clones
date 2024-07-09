import { Editor, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { hashtagConfigure } from "../hashtags/hashtagSuggestion";
import { mentionConfigure } from "../mentions/mentionSuggestion";

interface UseTipTapProps {
  name: number;
  onChange: any;
}

export const useTipTap = ({ name, onChange }: UseTipTapProps) => {
  const editor: Editor | null = useEditor({
    extensions: [
      StarterKit,
      hashtagConfigure,
      mentionConfigure,
      Placeholder.configure({
        placeholder: name === 0 ? "Start a thread..." : "Say more...",
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "outline-none [&_.is-editor-empty:first-child::before]:text-[#adb5bd] [&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.is-editor-empty:first-child::before]:float-left [&_.is-editor-empty:first-child::before]:h-0 [&_.is-editor-empty:first-child::before]:pointer-events-none",
      },
    },
    content: ``,
    onUpdate: (props) => {
      const { editor } = props;
      const htmlContent = editor.getHTML();
      if (htmlContent !== "<p></p>") {
        onChange(htmlContent);
      } else {
        onChange("");
      }
    },
  });

  return {
    editor,
  };
};
