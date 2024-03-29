"use client";

import { Button, Input, Typography } from "antd";
import { useFoo } from "./hooks/useFoo";
import "./custom.scss";
import { createUserService } from "@/src/shared/services/user.service";

export const Foo = () => {
  const { text, setText, handleChangeFooText, fooTextValue, handleCreateUser } =
    useFoo();

  const a = async () =>
    await createUserService({
      userId: "10050",
      name: "2",
      avatar: "3",
    });

  return (
    <div className="w-[500px]">
      <Typography.Text>{fooTextValue}</Typography.Text>
      <Input onChange={(event) => setText(event.target.value)} />
      <Button id="button_foo" onClick={a}>
        Click
      </Button>
      {/* <div className="bg-slate-700 text-[#ffffff]" onClick={handleCreateUser}>
        Create User
      </div> */}
    </div>
  );
};
