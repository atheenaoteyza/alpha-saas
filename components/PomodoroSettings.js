import TomatoSVG from "@/assets/Tomato";
import { useState } from "react";

export default function PomodoroSettings() {
  const [modal, setModal] = useState(false);
  return (
    <>
      <div className="p-3 cursor-pointer hover:border border-gray-600 rounded-2xl bg-[rgba(20,20,20,0.7)] hover:bg-[rgba(20,20,20,1)]">
        <div className="flex items-center">
          <TomatoSVG
            className="h-8 w-8"
            onClick={() => setModal(!modal)}
          ></TomatoSVG>
        </div>
      </div>
      {modal && (
        <section className="absolute mb-[40rem] flex h-[500px] w-[500px] p-2 hover:border border-gray-600 rounded-2xl bg-[rgba(20,20,20,0.7)] hover:bg-[rgba(20,20,20,1)]">
          <div>Hello</div>
        </section>
      )}
    </>
  );
}
