"use client";

import { Button, Input, Typography } from "antd";
import { useFoo } from "./hooks/useFoo";
import "./custom.scss";

export const Foo = () => {
  const { text, setText, handleChangeFooText, fooTextValue, handleCreateUser } =
    useFoo();

  return (
    <div className="w-[500px]">
      <Typography.Text>{fooTextValue}</Typography.Text>
      <Input onChange={(event) => setText(event.target.value)} />
      <Button id="button_foo" onClick={() => handleChangeFooText(text)}>
        Click
      </Button>
      <div className="bg-slate-700 text-[#ffffff]" onClick={handleCreateUser}>
        Create User
      </div>
    </div>
  );
};
