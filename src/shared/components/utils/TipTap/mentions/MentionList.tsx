import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import clsx from "clsx";
import Image from "next/image";

export type MentionListRef = {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
};

export const MentionList = forwardRef<MentionListRef, any>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const selectItem = (index: number) => {
    const item = props.items[index].username;

    if (item) {
      props.command({ id: item });
    }
  };

  const upHandler = () => {
    setSelectedIndex(
      (selectedIndex + props.items.length - 1) % props.items.length
    );
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }

      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }

      if (event.key === "Enter") {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <div className="bg-white rounded-lg shadow-md text-opacity-80 text-sm overflow-hidden p-1 relative">
      {props.items.length
        ? props.items.map((item: any, index: number) => (
            <button
              className={clsx(
                `bg-transparent flex gap-2 items-center border border-solid border-transparent rounded-md m-0 py-1 px-2 text-primary text-left w-full`,
                index === selectedIndex ? "!bg-primary" : ""
              )}
              key={index}
              onClick={() => selectItem(index)}
            >
              <Image
                src={item.avatar}
                alt="Avatar"
                width={36}
                height={36}
                className="rounded-full"
              />
              <div className="flex flex-col gap-1">
                <span
                  className={clsx(
                    "text-sm font-semibold",
                    index === selectedIndex ? "!text-white" : "!text-black"
                  )}
                >
                  {item.username}
                </span>
                <span
                  className={clsx(
                    "text-sm font-light",
                    index === selectedIndex
                      ? "!text-[#dddddd]"
                      : "!text-[#222222]"
                  )}
                >
                  {item.name}
                </span>
              </div>
            </button>
          ))
        : null}
    </div>
  );
});

MentionList.displayName = "MentionList";
