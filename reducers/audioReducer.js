export const audioInitialState = {
  rain: 0,
  wave: 0,
  bird: 0,
  rainSound: 0,
  rainEffect: false,
};

export function audioReducer(state, action) {
  switch (action.type) {
    case "SET_RAIN_VOLUME":
      return {
        ...state,
        rainSound: action.payload,
      };
    case "SET_WAVE_VOLUME":
      return {
        ...state,
        wave: action.payload,
      };
    case "SET_BIRD_VOLUME":
      return {
        ...state,
        bird: action.payload,
      };

    case "SET_RAIN_EFFECT":
      if (state.rainEffect) {
        return {
          ...state,
          rain: action.payload,
        };
      } else {
        return state;
      }
    case "TOGGLE_RAIN_EFFECT":
      return {
        ...state,
        rainEffect:
          typeof action.payload === "boolean"
            ? action.payload
            : !state.rainEffect,
      };

    case "MUTE_AUDIO":
      return audioInitialState;
    default:
      return state;
  }
}
