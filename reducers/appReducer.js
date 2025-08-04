export const lofiInitialState = {
  isVideo: true,
  videoId: "vYIYIVmOo3Q",
  isMuted: true,
  volume: 0.5,
  previousVolume: 0.5,
  isRunning: false,
  isPomodoroOn: false,
  stopwatchTime: 0,
  secondsLeft: 900,
  workCount: 0,
  mode: "work",
  focusLog: [], // moved here
  restartVideo: false, // new field to trigger video restart
  settings: {
    workDuration: 15,
    shortBreak: 5,
    longBreak: 15,
    intervalsBeforeLong: 1,
  },
};

export function lofiReducer(state, action) {
  switch (action.type) {
    case "TOGGLE_VIDEO":
      return {
        ...state,
        isVideo: !state.isVideo,
      };

    case "TOGGLE_RUNNING":
      return {
        ...state,
        isRunning: !state.isRunning,
        isMuted: state.isRunning,
      };

    case "TOGGLE_MUTE":
      if (state.isMuted) {
        return {
          ...state,
          isMuted: false,
          volume: state.previousVolume || 0.5,
        };
      } else {
        return {
          ...state,
          isMuted: true,
          previousVolume: state.volume,
          volume: 0,
        };
      }

    case "SET_VOLUME":
      return { ...state, volume: action.payload };

    case "CHANGE_VIDEO_ID":
      return {
        ...state,
        videoId: action.payload,
      };

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
    case "GET_FOCUS_LOG":
      return { ...state, focusLog: action.payload };

    case "RESTART_VIDEO":
      return { ...state, restartVideo: !state.restartVideo };

    default:
      return state;
  }
}
