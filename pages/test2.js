import { useState, useEffect, useRef } from "react";
import YoutubeBackground from "@/components/YoutubeBackground";
import ToolSection from "@/components/ToolSection";
import { Geist, Geist_Mono } from "next/font/google";
import Pomodoro from "@/components/usePomodoroTimer";
import { timerReducer, timerInitialState } from "@/components/usePomodoroTimer";
import { useReducer } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function DashBoard() {
  const [state, dispatch] = useReducer(timerReducer, timerInitialState);

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} youtube-background`}
    >
      <YoutubeBackground isMuted={state.isMuted} />

      <div className="flex flex-col justify-between">
        <section>
          <ToolSection streak={0} />
        </section>

        <div className="h-[85vh]  flex justify-center items-end">
          <section className=" flex flex-col items-center justify-center w-[40%] h-[30%] p-[2rem]">
            <div className={state.isMuted ? "text-white" : "text-transparent"}>
              Ready to go?
            </div>
            <Pomodoro state={state} dispatch={dispatch} />{" "}
          </section>
        </div>
      </div>
    </div>
  );
}
