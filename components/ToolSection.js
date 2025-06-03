import { FlameIcon } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export default function ToolSection({ streak }) {
  return (
    <>
      <div
        className="content flex justify-end "
        style={{
          position: "relative",
          zIndex: 20,
          backgroundColor: "rgba(20, 20, 20, 0.7)", // gray-400 with 5% opacity
        }}
      >
        <div className="flex m-[1rem] w-full justify-between">
          <div className="p-2">hello</div>

          <div className=" w-full flex justify-center items-center">
            <div className="flex streaks p-2 bg-gray-900 border border-gray-600 rounded-2xl">
              <FlameIcon></FlameIcon>
              <p className="ml-1"> {`Days Streak : ${streak}`}</p>
            </div>
          </div>

          <div className="p-2">
            {" "}
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: "32px",
                    height: "32px",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
