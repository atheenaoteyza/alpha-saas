import DoneButton from "@/components/DoneButton";
import PomodoroSwitch from "@/components/PomodoroSwitch";
import { PauseIcon, PlayIcon, LoaderCircleIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PomodoroSettings from "./PomodoroSettings";
import Calendar from "./Calendar";
import ConfettiExplosion from "react-confetti-explosion";
import WorkDoneToast from "./WorkDoneToast";

export default function Pomodoro({ state, dispatch }) {
  const pomodoroRef = useRef();
  const stopwatchRef = useRef();
  const secondsLeftRef = useRef(state.secondsLeft);
  const logs = state.focusLog?.logs;
  const dates = Array.isArray(logs)
    ? logs.map((entry) => new Date(entry.date).toISOString().split("T")[0])
    : [];

  const [isLoading, setIsLoading] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const [isToast, setIsToast] = useState(false);
  const [completedTime, setCompletedTime] = useState(null);
  useEffect(() => {
    const fetchInitialFocusLog = async () => {
      try {
        const res = await fetch("/api/hello2");
        if (!res.ok) {
          const text = await res.text();
          console.error("Unexpected response", text);
          throw new Error("Failed to fetch");
        }
        const data = await res.json();

        if (data && data.logs) {
          dispatch({ type: "GET_FOCUS_LOG", payload: data });
          console.log("Initial streak:", data.days.currentStreak);
        } else {
          console.log("No focus log data yet");
        }
      } catch (err) {
        console.error("Failed to fetch focus logs on mount:", err);
      }
    };

    fetchInitialFocusLog();
  }, []);

  useEffect(() => {
    secondsLeftRef.current = state.secondsLeft;
  }, [state.secondsLeft]);

  useEffect(() => {
    if (!state.isRunning) {
      clearInterval(stopwatchRef.current);
      clearInterval(pomodoroRef.current);
      return;
    }

    stopwatchRef.current = setInterval(() => {
      dispatch({ type: "TICK_STOPWATCH" });
    }, 1000);

    if (state.isPomodoroOn) {
      pomodoroRef.current = setInterval(() => {
        if (secondsLeftRef.current <= 1) {
          clearInterval(pomodoroRef.current);
        }
        dispatch({ type: "TICK_SECONDSLEFT" });
      }, 1000);
    }

    return () => {
      clearInterval(stopwatchRef.current);
      clearInterval(pomodoroRef.current);
    };
  }, [
    state.isRunning,
    state.isPomodoroOn,
    state.mode,
    state.secondsLeft,
    state.settings.shortBreak,
    state.settings.longBreak,
    state.settings.workDuration,
  ]);

  useEffect(() => {
    if (state.isRunning && state.isPomodoroOn && state.secondsLeft === 0) {
      const nextMode =
        state.mode === "work" &&
        state.workCount + 1 >= state.settings.intervalsBeforeLong
          ? "longBreak"
          : state.mode === "work"
          ? "shortBreak"
          : "work";

      if (state.mode === "work") dispatch({ type: "INCREMENT_WORK" });
      dispatch({ type: "SWITCH_MODE", payload: nextMode });
    }
  }, [state.secondsLeft, state.isRunning, state.isPomodoroOn]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleComplete = async () => {
    if (state.stopwatchTime === 0) return;
    setIsLoading(true);
    setIsExploding(true);

    try {
      // artificial delay (e.g., 2 seconds)
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      const today = new Date();
      const id = today.toLocaleDateString();
      const timeSpent = state.stopwatchTime;
      console.log(`DEEP WORK COMPLETE: ${formatTime(timeSpent)}`);
      setCompletedTime(formatTime(timeSpent));
      setIsToast(true);

      const res = await fetch("api/hello2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: id, focusTime: timeSpent }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      dispatch({ type: "GET_FOCUS_LOG", payload: data });
      dispatch({ type: "RESET" });
      console.log("useeffect streak:", data.days.currentStreak);
    } catch (error) {
      console.error("Error completing session", error);
    } finally {
      setIsLoading(false);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsExploding(false);
    }
  };

  return (
    <div>
      <div
        className={`text-white text-4xl font-mono mb-4 flex justify-center ${
          isLoading ? "invisible" : ""
        }`}
      >
        {state.isPomodoroOn
          ? formatTime(state.secondsLeft)
          : formatTime(state.stopwatchTime)}
      </div>
      <div className="play-button flex justify-center gap-2 items-center">
        <button
          className="p-4 border border-gray-600 rounded-2xl bg-[rgba(20,20,20,0.7)] hover:bg-[rgba(20,20,20,1)]"
          onClick={() => {
            // Check if timer is at 00:00 and not running - restart video
            if (!state.isRunning && state.stopwatchTime === 0) {
              dispatch({ type: "RESTART_VIDEO" });
            }
            dispatch({ type: "TOGGLE_RUNNING" });
          }}
        >
          {state.isRunning ? <PauseIcon /> : <PlayIcon />}
        </button>

        <DoneButton handleComplete={handleComplete} isLoading={isLoading} />
        <PomodoroSwitch
          setIsOn={() => dispatch({ type: "TOGGLE_POMODORO" })}
          isOn={state.isPomodoroOn}
        />
        <PomodoroSettings state={state} dispatch={dispatch} />
        <Calendar dates={dates} />
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-2xl  ">
          {" "}
          {isExploding && <ConfettiExplosion />}
        </div>
        {!isLoading
          ? isToast && (
              <WorkDoneToast
                completedTime={completedTime}
                setIsToast={setIsToast}
              />
            )
          : null}
      </div>
    </div>
  );
}
