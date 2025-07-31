import DoneButton from "@/components/DoneButton";
import PomodoroSwitch from "@/components/PomodoroSwitch";
import { PauseIcon, PlayIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import PomodoroSettings from "./PomodoroSettings";
import calcStreak from "@/utils/calcStreak";
import Calendar from "./Calendar";

export default function Pomodoro({ state, dispatch }) {
  const pomodoroRef = useRef();
  const stopwatchRef = useRef();
  const secondsLeftRef = useRef(state.secondsLeft);
  const logs = state.focusLog?.logs;
  const dates = Array.isArray(logs)
    ? logs.map((entry) => new Date(entry.date).toISOString().split("T")[0])
    : [];

  useEffect(() => {
    const fetchInitialFocusLog = async () => {
      try {
        const res = await fetch("/api/hello2");
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
    const today = new Date();
    const id = today.toLocaleDateString();
    const timeSpent = state.stopwatchTime;

    await fetch("/api/hello2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: id,
        focusTime: timeSpent,
      }),
    });

    // 2. Send GET request to fetch updated logs + streak
    const res = await fetch("/api/hello2");
    const data = await res.json();
    if (data && data.days) {
      console.log("Streak:", data.days.currentStreak);
    } else {
      console.log("No streak data yet");
    }
    dispatch({
      type: "GET_FOCUS_LOG",
      payload: data,
    });
    dispatch({ type: "RESET" });
  };

  useEffect(() => {
    if (!state.focusLog || !state.focusLog.logs || !state.focusLog.days) return;

    const result = calcStreak(state.focusLog.logs);
    console.log("Streak data:", result);
    console.log("All focus logs:", state.focusLog.logs);
    console.log("All streaks", state.focusLog.days);
    console.log(
      "Dates only:",
      state.focusLog.logs.map((entry) => entry.date)
    );
    console.log(state.focusLog);
  }, [state.focusLog]);

  return (
    <div>
      <div className="text-white text-4xl font-mono mb-4 flex justify-center">
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

        <DoneButton handleComplete={handleComplete} />
        <PomodoroSwitch
          setIsOn={() => dispatch({ type: "TOGGLE_POMODORO" })}
          isOn={state.isPomodoroOn}
        />
        <PomodoroSettings state={state} dispatch={dispatch} />
        <Calendar dates={dates} />
      </div>
    </div>
  );
}
