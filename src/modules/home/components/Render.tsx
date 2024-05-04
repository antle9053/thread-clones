import React, { FC } from "react";
import Link from "next/link";
import parse, { HTMLReactParserOptions, domToReact } from "html-react-parser";

interface RenderProps {
  content: string;
}
const options: HTMLReactParserOptions = {
  replace({ attribs, children }: any) {
    if (!attribs) {
      return;
    }

    if (attribs["data-type"] === "mention") {
      return (
        <Link
          href={`/search?q=${attribs["data-id"]}`}
          className="text-[#0095F6]"
          onClick={(e) => e.stopPropagation()}
        >
          {domToReact(children, options)}
        </Link>
      );
    }
  },
};

export const Render: FC<RenderProps> = ({ content }) => parse(content, options);
