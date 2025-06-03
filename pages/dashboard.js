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

  // Timer states
  const [time, setTime] = useState(0); // Time in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isPomodoroActive, setIsPomodoroActive] = useState(false);
  const intervalRef = useRef(null);

  // Pomodoro constants (in seconds)
  const POMODORO_WORK_TIME = 25 * 60; // 25 minutes
  const POMODORO_BREAK_TIME = 5 * 60; // 5 minutes

  // Initialize timer based on mode
  useEffect(() => {
    if (isOn && !isPomodoroActive) {
      // Start with work session when switching to Pomodoro mode
      setTime(POMODORO_WORK_TIME);
      setIsPomodoroActive(true);
    } else if (!isOn && isPomodoroActive) {
      // Reset to stopwatch mode
      setTime(0);
      setIsPomodoroActive(false);
      setIsRunning(false);
    }
  }, [isOn]);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (isOn) {
            // Pomodoro mode - countdown
            if (prevTime <= 1) {
              // Timer finished
              setIsRunning(false);
              setIsMuted(true); // Turn off audio when timer finishes
              // You can add notification/sound here
              return 0;
            }
            return prevTime - 1;
          } else {
            // Stopwatch mode - count up
            return prevTime + 1;
          }
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, isOn]);

  // Format time display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Toggle play/pause
  const toggleTimer = () => {
    const newRunningState = !isRunning;
    setIsRunning(newRunningState);
    // Auto-control audio based on timer state
    setIsMuted(!newRunningState);
  };

  // Reset/Complete timer
  const handleComplete = () => {
    setIsRunning(false);
    setIsMuted(true); // Turn off audio when timer stops
    if (isOn) {
      // Pomodoro mode - reset to work time
      setTime(POMODORO_WORK_TIME);
      setStreak((prev) => prev + 1); // Increment streak on completion
    } else {
      // Stopwatch mode - reset to 0
      setTime(0);
    }
  };

  return (
    <>
      <div
        className={`${geistSans.className} ${geistMono.className} youtube-background`}
      >
        <YoutubeBackground isMuted={isMuted}></YoutubeBackground>
        <div className="flex flex-col justify-between">
          <section>
            <ToolSection streak={streak}></ToolSection>
          </section>
          <div className="h-[85vh] border flex justify-center items-end">
            <section className="border flex flex-col items-center justify-center w-[40%] h-[30%] p-[2rem]">
              <div className={isMuted ? "text-white" : "text-transparent"}>
                Ready to go?
              </div>

              {/* Timer Display */}
              <div className="text-white text-4xl font-mono mb-4">
                {formatTime(time)}
              </div>

              {/* Mode Indicator */}
              <div className="text-white text-sm mb-4 opacity-70">
                {isOn ? "Pomodoro Mode" : "Stopwatch Mode"}
              </div>

              <div className="play-button flex justify-center gap-2 items-center">
                {/* Play/Pause Button */}
                <button
                  className="p-4 border border-gray-600 rounded-2xl bg-[rgba(20,20,20,0.7)] hover:bg-[rgba(20,20,20,1)]"
                  onClick={toggleTimer}
                >
                  {isRunning ? <PauseIcon /> : <PlayIcon />}
                </button>

                {/* Complete/Reset Button */}
                <button
                  className="p-4 border border-gray-600 rounded-2xl bg-[rgba(20,20,20,0.7)] hover:bg-[rgba(20,20,20,1)] disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleComplete}
                  disabled={isRunning && isOn && time > 0} // Disable during active Pomodoro session
                >
                  <CheckIcon />
                </button>

                {/* Pomodoro Switch */}
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
