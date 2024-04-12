import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";

import { MentionList, MentionListRef } from "./MentionList";
import { SuggestionKeyDownProps, SuggestionProps } from "@tiptap/suggestion";
import { MentionOptions } from "@tiptap/extension-mention";
import { getTagsService } from "@/src/shared/services/tags.service";

export const suggestion: MentionOptions["suggestion"] = {
  allowSpaces: true,
  char: "#",
  items: async ({ query }) => {
    if (query.length >= 1) {
      const tags = await getTagsService(query);
      return tags.map((tag) => tag.title);
    }
    return [];
  },

  render: () => {
    let component: ReactRenderer<MentionListRef>;
    let popup: any;

    return {
      onStart: (props: SuggestionProps<any>) => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        //@ts-ignore
        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate(props: SuggestionProps<any>) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props: SuggestionKeyDownProps) {
        if (props.event.key === "Escape") {
          popup[0].hide();

          return true;
        }

        return component.ref?.onKeyDown(props) as boolean;
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};
