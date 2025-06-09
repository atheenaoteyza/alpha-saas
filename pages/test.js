import DoneButton from "@/components/DoneButton";
import PomodoroSwitch from "@/components/PomodoroSwitch";
import { PauseIcon, PlayIcon } from "lucide-react";
import { useEffect, useReducer, useRef } from "react";

const timerInitialState = {
  isMuted: true,
  isRunning: false,
  isPomodoroOn: false,
  stopwatchTime: 0,
  secondsLeft: 10,
  workCount: 0,
  mode: "work",
  settings: {
    workDuration: 1,
    shortBreak: 1,
    longBreak: 15,
    intervalsBeforeLong: 2,
  },
};

function timerReducer(state, action) {
  switch (action.type) {
    case "TOGGLE_RUNNING":
      return { ...state, isRunning: !state.isRunning, isMuted: !state.isMuted };

    case "TICK_STOPWATCH":
      return { ...state, stopwatchTime: state.stopwatchTime + 1 };

    case "TICK_SECONDSLEFT":
      return { ...state, secondsLeft: state.secondsLeft - 1 };

    case "TOGGLE_POMODORO":
      if (!state.isPomodoroOn) {
        return {
          ...state,
          isPomodoroOn: !state.isPomodoroOn,
          secondsLeft: state.settings.workDuration * 60,
          workCount: 0,
          mode: "work",
        };
      }
      return { ...state, isPomodoroOn: !state.isPomodoroOn };

    case "RESET":
      return {
        ...state,
        isRunning: false,
        stopwatchTime: 0,
        workCount: 0,
        mode: "work",
        secondsLeft: state.settings.workDuration * 60,
      };

    case "SWITCH_MODE": {
      const duration =
        action.payload === "work"
          ? state.settings.workDuration
          : action.payload === "shortBreak"
          ? state.settings.shortBreak
          : state.settings.longBreak;

      return {
        ...state,
        mode: action.payload,
        secondsLeft: duration * 60,
        isRunning: true,
        isPomodoroOn: true,
      };
    }

    case "INCREMENT_WORK":
      return { ...state, workCount: state.workCount + 1 };

    case "SET_INTERVALS":
      return {
        ...state,
        settings: { ...state.settings, intervalsBeforeLong: action.payload },
      };

    default:
      return state;
  }
}

export default function usePomodoroTimer() {
  const [state, dispatch] = useReducer(timerReducer, timerInitialState);
  const pomodoroRef = useRef();
  const stopwatchRef = useRef();
  const secondsLeftRef = useRef(state.secondsLeft);

  useEffect(() => {
    // Whenever mode or secondsLeft changes, sync the ref immediately
    secondsLeftRef.current = state.secondsLeft;
  }, [state.mode, state.secondsLeft]);

  useEffect(() => {
    if (!state.isRunning) {
      clearInterval(stopwatchRef.current);
      clearInterval(pomodoroRef.current);
      return;
    }

    // Stopwatch always running
    stopwatchRef.current = setInterval(() => {
      dispatch({ type: "TICK_STOPWATCH" });
    }, 1000);

    // Pomodoro countdown
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
  }, [state.isRunning, state.isPomodoroOn, state.mode]); // ✅ simplified and correct deps

  // Optional: auto-switch mode when time runs out
  useEffect(() => {
    if (state.isPomodoroOn && state.isRunning && state.secondsLeft === 0) {
      if (state.mode === "work") {
        const newCount = state.workCount + 1;
        dispatch({ type: "INCREMENT_WORK" });

        if (newCount % state.settings.intervalsBeforeLong === 0) {
          dispatch({ type: "SWITCH_MODE", payload: "long" });
        } else {
          dispatch({ type: "SWITCH_MODE", payload: "short" });
        }
      } else {
        dispatch({ type: "SWITCH_MODE", payload: "work" });
      }
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
  return (
    <>
      <div>
        <div className="text-white text-4xl font-mono mb-4">
          {state.isPomodoroOn
            ? formatTime(state.secondsLeft)
            : formatTime(state.stopwatchTime)}
        </div>
        <div className="play-button flex justify-center gap-2 items-center">
          <button
            className="p-4 border border-gray-600 rounded-2xl bg-[rgba(20,20,20,0.7)] hover:bg-[rgba(20,20,20,1)]"
            onClick={() => dispatch({ type: "TOGGLE_RUNNING" })}
          >
            {state.isRunning ? <PauseIcon /> : <PlayIcon />}
          </button>

          <DoneButton handleComplete={() => dispatch({ type: "RESET" })} />
          <PomodoroSwitch
            setIsOn={() => dispatch({ type: "TOGGLE_POMODORO" })}
            isOn={state.isPomodoroOn}
          />
        </div>
      </div>
    </>
  );
}
