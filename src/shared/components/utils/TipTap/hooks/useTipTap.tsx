import Mention from "@tiptap/extension-mention";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { suggestion } from "../suggestion";
import Placeholder from "@tiptap/extension-placeholder";

interface UseTipTapProps {
  name: number;
  onChange: any;
}

export const useTipTap = ({ name, onChange }: UseTipTapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Mention.configure({
        HTMLAttributes: {
          class: "text-[#0095F6]",
        },
        suggestion,
      }),
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
