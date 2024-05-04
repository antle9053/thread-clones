import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";

import { MentionList, MentionListRef } from "./MentionList";
import { SuggestionKeyDownProps, SuggestionProps } from "@tiptap/suggestion";
import Mention, { MentionOptions } from "@tiptap/extension-mention";
import { getUsersService } from "@/src/shared/services/user.service";
import { PluginKey } from "@tiptap/pm/state";

const mentionSuggestion: MentionOptions["suggestion"] = {
  allowSpaces: true,
  char: "@",
  items: async ({ query }) => {
    if (query.length >= 1) {
      const users = await getUsersService(query);
      return users;
    }
    return [];
  },
  pluginKey: new PluginKey("mention"),

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

export const mentionConfigure = Mention.extend({
  name: "mention",
}).configure({
  HTMLAttributes: {
    class: "text-[#0095F6]",
  },
  suggestion: mentionSuggestion,
});
