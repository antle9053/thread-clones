import { Foo } from "@/src/modules/foo";
import { UserButton } from "@clerk/nextjs";

const FooPage = () => {
  return (
    <div className="bg-slate-300 h-[200px]">
      <UserButton />
      <Foo />
    </div>
  );
};

export default FooPage;
