import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className=" h-screen w-screen flexcenter">
      <SignUp />
    </div>
  );
}
