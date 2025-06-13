import { useState, useEffect, useRef } from "react";

export default function PomodoroTimer() {
  const [workDuration, setWorkDuration] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const [intervalsBeforeLong, setIntervalsBeforeLong] = useState(1);

  const [secondsLeft, setSecondsLeft] = useState(workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("work"); // work, short, long
  const [workCount, setWorkCount] = useState(0);

  const timerRefs = useRef(null);

  useEffect(() => {
    if (!isRunning) return;

    timerRefs.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRefs.current);
  }, [isRunning]);

  useEffect(() => {
    if (secondsLeft === 0 && isRunning) {
      handleTimerEnd();
    }
  }, [secondsLeft, isRunning]);

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

  const switchMode = (newMode) => {
    setMode(newMode);
    const duration =
      newMode === "work"
        ? workDuration
        : newMode === "short"
        ? shortBreak
        : longBreak;
    setSecondsLeft(duration * 60);
  };

  const formatTime = () => {
    const minutes = Math.floor(secondsLeft / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (secondsLeft % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleReset = () => {
    switchMode("work");
    setWorkCount(0);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg space-y-6">
      <h1 className="text-2xl font-bold text-center">Pomodoro Timer</h1>

      <div className="flex flex-col space-y-2">
        <label className="font-medium">Work Duration (minutes)</label>
        <input
          type="number"
          value={workDuration}
          onChange={(e) => setWorkDuration(Number(e.target.value))}
          className="input"
        />
        <label className="font-medium">Short Break Duration (minutes)</label>
        <input
          type="number"
          value={shortBreak}
          onChange={(e) => setShortBreak(Number(e.target.value))}
          className="input"
        />
        <label className="font-medium">Long Break Duration (minutes)</label>
        <input
          type="number"
          value={longBreak}
          onChange={(e) => setLongBreak(Number(e.target.value))}
          className="input"
        />
        <label className="font-medium">Work Intervals Before Long Break</label>
        <input
          type="number"
          value={intervalsBeforeLong}
          onChange={(e) => setIntervalsBeforeLong(Number(e.target.value))}
          className="input"
        />
      </div>

      <div className="text-center text-5xl font-mono">{formatTime()}</div>
      <div className="text-center text-sm text-gray-500 capitalize">
        Mode: {mode}
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-xl"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
