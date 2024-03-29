import { Flex } from "antd";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <Flex
      style={{
        width: "100vw",
        height: "100vh",
      }}
      justify="center"
      align="center"
    >
      <SignIn />
    </Flex>
  );
}
