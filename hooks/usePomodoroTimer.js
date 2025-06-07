import { useEffect, useReducer, useRef } from "react";

const timerInitialState = {
  isMuted: "true",
  isRunning: "false",
  isPomodoroOn: "false",
  stopwatchTime: 0,
  secondsLeft: 900,
  workCount: 0,
  mode: "work",
  settings: {
    workDuration: 15,
    shortBreak: 5,
    longBreak: 15,
    intervalsBeforeLong: 1,
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
      return { ...state, isPomodoroOn: !isPomodoroOn };

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
      };
    }

    case "INCREMENT_WORK": {
      return { ...state, workCount: state.workCount + 1 };
    }

    case "SET_INTERVALS": {
      return {
        ...state,
        settings: { ...state.settings, intervalsBeforeLong: action.payload },
      };
    }
  }
}

export default function usePomodoroTimer() {
  const [state, dispatch] = useReducer(timerReducer, timerInitialState);
  const pomodoroRefs = useRef();
  const stopwatchRefs = useRef();

  useEffect(() => {
    if (!state.isRunning) {
      clearInterval(stopwatchRefs.current);
      clearInterval(pomodoroRefs.current);
      return;
    }

    // Stopwatch mode always running when running
    stopwatchRefs.current = setInterval(() => {
      dispatch({ type: "TICK_STOPWATCH" });
    }, 1000);

    if (state.isPomodoroOn) {
      pomodoroRefs.current = setInterval(() => {
        if (state.secondsLeft <= 1) {
          clearInterval(pomodoroRefs.current);
          return 0;
        } else {
          dispatch({ type: "TICK_POMODORO" });
        }
      }, 1000);
    }

    return () => {};
  });

  return <></>;
}

// export default function Counter() {
//   const [state, dispatch] = useReducer(reducer, { age: 42 });

//   return (
//     <>
//       <button
//         onClick={() => {
//           dispatch({ type: "incremented_age" });
//         }}
//       >
//         Increment age
//       </button>
//       <p>Hello! You are {state.age}.</p>
//     </>
//   );
// }
