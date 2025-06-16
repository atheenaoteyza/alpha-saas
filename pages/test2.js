import { useState, useEffect, useRef } from "react";
import YoutubeBackground from "@/components/YoutubeBackground";
import ToolSection from "@/components/ToolSection";
import { PlayIcon, PauseIcon, CheckIcon } from "lucide-react";
import PomodoroSwitch from "@/components/PomodoroSwitch";
import { Geist, Geist_Mono } from "next/font/google";
import DoneButton from "@/components/DoneButton";
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
  const [isMuted, setIsMuted] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [isOn, setIsOn] = useState(false); // Just for toggle UI
  const [time, setTime] = useState(0);
  const intervalRef = useRef(null);

  const [workDuration, setWorkDuration] = useState(1);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const [intervalsBeforeLong, setIntervalsBeforeLong] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(workDuration * 60);
  const [mode, setMode] = useState("work"); // work, short, long
  const [workCount, setWorkCount] = useState(0);
  const timerRefs = useRef(null);

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
