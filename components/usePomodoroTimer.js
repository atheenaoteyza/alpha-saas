import DoneButton from "@/components/DoneButton";
import PomodoroSwitch from "@/components/PomodoroSwitch";
import { PauseIcon, PlayIcon } from "lucide-react";
import { useEffect, useReducer, useRef } from "react";
import PomodoroSettings from "./PomodoroSettings";
import calculateStreak from "@/utils/calculateStreak";

export const timerInitialState = {
  isMuted: true,
  isRunning: false,
  isPomodoroOn: false,
  stopwatchTime: 0,
  secondsLeft: 900,
  workCount: 0,
  mode: "work",
  focusLog: [], // moved here
  settings: {
    workDuration: 15,
    shortBreak: 5,
    longBreak: 15,
    intervalsBeforeLong: 1,
  },
};

export function timerReducer(state, action) {
  switch (action.type) {
    case "TOGGLE_RUNNING":
      return { ...state, isRunning: !state.isRunning, isMuted: !state.isMuted };

    case "TICK_STOPWATCH":
      return { ...state, stopwatchTime: state.stopwatchTime + 1 };

    case "TICK_SECONDSLEFT":
      return { ...state, secondsLeft: state.secondsLeft - 1 };

    case "TOGGLE_POMODORO":
      return { ...state, isPomodoroOn: !state.isPomodoroOn };

    case "RESET":
      return {
        ...state,
        isRunning: false,
        isMuted: true,
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

    case "BULK_UPDATE_SETTINGS":
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };

    case "ADD_FOCUS_LOG": {
      const { id, timeSpent } = action.payload;
      const existingEntry = state.focusLog.find((entry) => entry[id]);
      let updatedFocusLog;

      if (existingEntry) {
        updatedFocusLog = state.focusLog.map((entry) => {
          if (entry[id]) {
            return {
              [id]: {
                ...entry[id],
                focusTime: entry[id].focusTime + timeSpent,
              },
            };
          }
          return entry;
        });
      } else {
        const newEntry = {
          [id]: {
            date: id,
            focusTime: timeSpent,
          },
        };
        updatedFocusLog = [...state.focusLog, newEntry];
      }

      return {
        ...state,
        focusLog: updatedFocusLog,
      };
    }

    default:
      return state;
  }
}

export default function Pomodoro({ state, dispatch }) {
  const pomodoroRef = useRef();
  const stopwatchRef = useRef();
  const secondsLeftRef = useRef(state.secondsLeft);
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

  const handleComplete = () => {
    const today = new Date();
    const id = today.toLocaleDateString();
    const timeSpent = state.stopwatchTime;

    dispatch({
      type: "ADD_FOCUS_LOG",
      payload: { id, timeSpent },
    });

    dispatch({ type: "RESET" });
  };

  useEffect(() => {
    console.log(calculateStreak(state.focusLog));
    console.log(state.focusLog);
  }, [state.focusLog]);

  return (
    <>
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
        </div>
      </div>
    </>
  );
}
