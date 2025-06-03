import YoutubeBackground from "@/components/YoutubeBackground";
import { useState, useEffect, useRef } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import ToolSection from "@/components/ToolSection";
import { PlayIcon, PauseIcon, CheckIcon } from "lucide-react";
import PomodoroSwitch from "@/components/PomodoroSwitch";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function DashBoard() {
  const [isMuted, setIsMuted] = useState(true);
  const [streak, setStreak] = useState(0);
  const [isOn, setIsOn] = useState(false);

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <>
      <div
        className={`${geistSans.className} ${geistMono.className} youtube-background`}
      >
        <YoutubeBackground isMuted={isMuted}></YoutubeBackground>

        <div className="flex flex-col justify-between">
          <section>
            {" "}
            <ToolSection streak={streak}></ToolSection>
          </section>
          <div className="h-[85vh] border  flex  justify-center items-end">
            <section className=" border  flex flex-col items-center justify-center w-[40%] h-[30%] p-[2rem]">
              <div className={isMuted ? "text-white" : "text-transparent"}>
                Ready to go?
              </div>
              <div className="play-button flex justify-center gap-2 items-center  ">
                {/* {
                  " add a timer here if pomodoro is on make it pomodoro if not just start normal 00:00:00"
                } */}
                <button
                  className="p-4 border border-gray-600 rounded-2xl bg-[rgba(20,20,20,0.7)] hover:bg-[rgba(20,20,20,1)]"
                  // style={{
                  //   backgroundColor: "rgba(20, 20, 20, 0.7)", // gray-400 with 5% opacity
                  // }}
                  onClick={toggleMute}
                >
                  {isMuted ? <PlayIcon /> : <PauseIcon />}
                </button>
                <button
                  className="p-4 border border-gray-600 rounded-2xl bg-[rgba(20,20,20,0.7)] hover:bg-[rgba(20,20,20,1)] disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={toggleMute}
                  disabled={isMuted}
                >
                  <CheckIcon />
                </button>
                <div
                  className={`p-4 border border-gray-600 rounded-2xl ${
                    isOn
                      ? "bg-[rgba(18,61,40,0.9)]"
                      : "bg-[rgba(20,20,20,0.7)] hover:bg-[rgba(20,20,20,1)]"
                  }`}
                >
                  <PomodoroSwitch setIsOn={setIsOn} isOn={isOn} />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
