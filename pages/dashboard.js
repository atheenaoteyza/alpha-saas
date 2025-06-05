import { useState, useEffect, useRef } from "react";
import YoutubeBackground from "@/components/YoutubeBackground";
import ToolSection from "@/components/ToolSection";
import { PlayIcon, PauseIcon, CheckIcon } from "lucide-react";
import PomodoroSwitch from "@/components/PomodoroSwitch";
import { Geist, Geist_Mono } from "next/font/google";
import DoneButton from "@/components/DoneButton";

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

  useEffect(() => {
    if (!isRunning) {
      clearInterval(intervalRef.current);
      clearInterval(timerRefs.current);
      return;
    }

    // Stopwatch Mode always running when running
    intervalRef.current = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    if (isOn) {
      // Pomodoro Timer Mode
      timerRefs.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRefs.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(timerRefs.current);
    };
  }, [workDuration, shortBreak, longBreak, mode, isRunning, isOn]);
  useEffect(() => {
    if (isRunning && isOn && secondsLeft === 0) {
      handleTimerEnd();
    }
  }, [secondsLeft, isRunning, isOn]);

  const handleTimerEnd = () => {
    if (mode === "work") {
      const newCount = workCount + 1;
      setWorkCount(newCount);
      if (newCount % intervalsBeforeLong === 0) {
        switchMode("long");
      } else {
        switchMode("short");
      }
    } else {
      switchMode("work");
    }
  };

  const switchMode = (newMode, autoStart = true) => {
    setMode(newMode);
    const duration =
      newMode === "work"
        ? workDuration
        : newMode === "short"
        ? shortBreak
        : longBreak;
    setSecondsLeft(duration * 60);
    setIsRunning(autoStart); // respect the flag
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
    setIsMuted((prev) => !prev);
  };

  const handleComplete = () => {
    setIsMuted(true);
    handleReset();
  };

  const handleReset = () => {
    setIsRunning(false);
    switchMode("work", false); // don't auto-resume
    setWorkCount(0);
    setTime(0);
  };

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} youtube-background`}
    >
      <YoutubeBackground isMuted={isMuted} />

      <div className="flex flex-col justify-between">
        <section>
          <ToolSection streak={0} />
        </section>

        <div className="h-[85vh]  flex justify-center items-end">
          <section className=" flex flex-col items-center justify-center w-[40%] h-[30%] p-[2rem]">
            <div className={isMuted ? "text-white" : "text-transparent"}>
              Ready to go?
            </div>

            <div className="text-white text-4xl font-mono mb-4">
              {isOn ? formatTime(secondsLeft) : formatTime(time)}
            </div>

            <div className="text-white text-sm mb-4 opacity-70">
              Stopwatch Mode
            </div>

            <div className="play-button flex justify-center gap-2 items-center">
              <button
                className="p-4 border border-gray-600 rounded-2xl bg-[rgba(20,20,20,0.7)] hover:bg-[rgba(20,20,20,1)]"
                onClick={toggleTimer}
              >
                {isRunning ? <PauseIcon /> : <PlayIcon />}
              </button>

              <DoneButton handleComplete={handleComplete} />

              <PomodoroSwitch setIsOn={setIsOn} isOn={isOn} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
