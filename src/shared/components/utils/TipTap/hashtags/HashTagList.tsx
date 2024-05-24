import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import clsx from "clsx";

export type HashtagListRef = {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
};

export const HashtagList = forwardRef<HashtagListRef, any>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const selectItem = (index: number) => {
    const item = props.items[index];

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
      {props.query.length >= 1 &&
      (!props.items.every((item: string) => item === props.query) ||
        props.items.length === 0) ? (
        <button
          className={clsx(
            `bg-transparent border border-solid border-transparent rounded-md block m-0 py-1 px-2 text-primary text-left w-full`
          )}
          key={-1}
          onClick={() => {
            props.command({
              id: props.query,
            });
          }}
        >
          Tag new topic: #{props.query}
        </button>
      ) : null}
      {props.items.length
        ? props.items.map((item: any, index: number) => (
            <button
              className={clsx(
                `bg-transparent border border-solid border-transparent rounded-md block m-0 py-1 px-2 text-primary text-left w-full`,
                index === selectedIndex ? "!bg-primary !text-white" : ""
              )}
              key={index}
              onClick={() => selectItem(index)}
            >
              {item}
            </button>
          ))
        : null}
    </div>
  );
});

HashtagList.displayName = "HashtagList";
