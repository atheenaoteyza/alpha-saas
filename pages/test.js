import Pomodoro from "@/components/usePomodoroTimer";
import { timerReducer, timerInitialState } from "@/components/usePomodoroTimer";
import { useReducer } from "react";

export default function test() {
  const [state, dispatch] = useReducer(timerReducer, timerInitialState);
  console.log(state.isMuted);
  return (
    <>
      <Pomodoro></Pomodoro>
    </>
  );
}
