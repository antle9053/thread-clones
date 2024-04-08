"use client";

import React, {
  FC,
  KeyboardEvent,
  ReactNode,
  useMemo,
  useCallback,
  useRef,
  useEffect,
  useState,
} from "react";
import { Editor, Transforms, Range, createEditor, Descendant } from "slate";
import { withHistory } from "slate-history";
import {
  Slate,
  Editable,
  ReactEditor,
  withReact,
  RenderElementProps,
} from "slate-react";

interface ThreadEditorProps {
  name: number;
  onChange: any;
}

export type MentionElement = {
  type: "mention";
  character: string;
  children: Descendant[];
};

import { createPortal } from "react-dom";

export const Portal = ({ children }: { children?: ReactNode }) => {
  return typeof document === "object"
    ? createPortal(children, document.body)
    : null;
};

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

export const ThreadEditor: FC<ThreadEditorProps> = ({ name, onChange }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [target, setTarget] = useState<Range | null>(null);
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState("");
  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  );
  const withMentions = (editor: Editor) => {
    const { isInline, isVoid, markableVoid } = editor;

    editor.isInline = (element) => {
      return element.type === "mention" ? true : isInline(element);
    };

    editor.isVoid = (element) => {
      return element.type === "mention" ? true : isVoid(element);
    };

    editor.markableVoid = (element) => {
      return element.type === "mention" || markableVoid(element);
    };

    return editor;
  };

  const editor: Editor = useMemo(
    () => withMentions(withReact(withHistory(createEditor()))),
    []
  );

  const CHARACTERS = [
    "Aayla Secura",
    "Adi Gallia",
    "Admiral Dodd Rancit",
    "Admiral Firmus Piett",
    "Admiral Gial Ackbar",
    "Admiral Ozzel",
    "Admiral Raddus",
  ];

  const chars = CHARACTERS.filter((c) =>
    c.toLowerCase().startsWith(search.toLowerCase())
  ).slice(0, 10);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (target && chars.length > 0) {
        switch (event.key) {
          case "ArrowDown":
            event.preventDefault();
            const prevIndex = index >= chars.length - 1 ? 0 : index + 1;
            setIndex(prevIndex);
            break;
          case "ArrowUp":
            event.preventDefault();
            const nextIndex = index <= 0 ? chars.length - 1 : index - 1;
            setIndex(nextIndex);
            break;
          case "Tab":
          case "Enter":
            event.preventDefault();
            Transforms.select(editor, target);
            insertMention(editor, chars[index]);
            setTarget(null);
            break;
          case "Escape":
            event.preventDefault();
            setTarget(null);
            break;
        }
      }
    },
    [chars, editor, index, target]
  );

  const Mention = ({ attributes, children, element }: RenderElementProps) => {
    return (
      <span
        {...attributes}
        data-cy={`mention-${(element as MentionElement).character.replace(
          " ",
          "-"
        )}`}
        className="inline-block text-[#0095F6]"
      >
        #{(element as MentionElement).character}
        {children}
      </span>
    );
  };

  const Element = (props: RenderElementProps) => {
    const { attributes, children, element } = props;
    switch (element.type) {
      case "mention":
        return <Mention {...props} />;
      default:
        return <p {...attributes}>{children}</p>;
    }
  };

  const insertMention = (editor: Editor, character: string) => {
    const mention: MentionElement = {
      type: "mention",
      character,
      children: [{ text: "" }],
    };
    Transforms.insertNodes(editor, mention as any);
    Transforms.move(editor);
  };

  useEffect(() => {
    if (target && chars.length > 0) {
      const el = ref.current;
      const domRange = ReactEditor.toDOMRange(editor, target);
      const rect = domRange.getBoundingClientRect();
      if (el) {
        el.style.top = `${rect.top + window.scrollY + 24}px`;
        el.style.left = `${rect.left + window.scrollX}px`;
      }
    }
  }, [chars.length, editor, index, search, target]);

  return (
    <Slate
      editor={editor}
      initialValue={initialValue}
      onChange={(values) => {
        if (
          JSON.stringify(values) !==
          '[{"type":"paragraph","children":[{"text":""}]}]'
        ) {
          onChange(JSON.stringify(values));
        } else {
          onChange("");
        }
        const { selection } = editor;

        if (selection && Range.isCollapsed(selection)) {
          const [start] = Range.edges(selection);
          const wordBefore = Editor.before(editor, start, { unit: "word" });
          const before = wordBefore && Editor.before(editor, wordBefore);
          const beforeRange = before && Editor.range(editor, before, start);
          const beforeText = beforeRange && Editor.string(editor, beforeRange);
          const beforeMatch = beforeText && beforeText.match(/^#(\w+)$/);
          const after = Editor.after(editor, start);
          const afterRange = Editor.range(editor, start, after);
          const afterText = Editor.string(editor, afterRange);
          const afterMatch = afterText.match(/^(\s|$)/);

          if (beforeMatch && afterMatch) {
            setTarget(beforeRange);
            setSearch(beforeMatch[1]);
            setIndex(0);
            return;
          }
        }

        setTarget(null);
      }}
    >
      <Editable
        className="outline-0"
        renderElement={renderElement}
        onKeyDown={onKeyDown}
        onChange={(a) => {
          console.log(a);
        }}
        placeholder="Enter some text..."
      />
      {target && chars.length > 0 && (
        <Portal>
          <div
            ref={ref}
            style={{
              top: "0",
              left: "0",
              position: "absolute",
              zIndex: 999999,
              padding: "3px",
              background: "white",
              borderRadius: "4px",
              boxShadow: "0 1px 5px rgba(0,0,0,.2)",
            }}
            data-cy="mentions-portal"
          >
            {chars.map((char, i) => (
              <div
                key={char}
                onClick={() => {
                  Transforms.select(editor, target);
                  insertMention(editor, char);
                  setTarget(null);
                }}
                style={{
                  padding: "1px 3px",
                  borderRadius: "3px",
                  background: i === index ? "#B4D5FF" : "transparent",
                }}
              >
                {char}
              </div>
            ))}
          </div>
        </Portal>
      )}
    </Slate>
  );
};
