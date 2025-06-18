import TomatoSVG from "@/assets/Tomato";
import { useState, useReducer } from "react";
import { timerReducer, timerInitialState } from "./usePomodoroTimer";

export default function PomodoroSettings({ state, dispatch }) {
  const [modal, setModal] = useState(false);

  function handleSubmitForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newSettings = {
      workDuration: Number(formData.get("workDuration")),
      shortBreak: Number(formData.get("shortBreak")),
      longBreak: Number(formData.get("longBreak")),
      intervalsBeforeLong: Number(formData.get("intervalsBeforeLong")),
    };
    dispatch({
      type: "BULK_UPDATE_SETTINGS",
      payload: newSettings,
    });
    dispatch({ type: "RESET" }); // 👈 this applies the updated settings immediately
    setModal(false); // 👈 closes modal after saving
  }

  return (
    <>
      <div className="p-3 cursor-pointer hover:border border-gray-600 rounded-2xl bg-[rgba(20,20,20,0.7)] hover:bg-[rgba(20,20,20,1)]">
        <div className="flex items-center">
          <TomatoSVG
            className="h-8 w-8"
            onClick={() => setModal(!modal)}
          ></TomatoSVG>
        </div>
      </div>
      {modal && (
        <section className="absolute mb-[45rem] h-[400px] w-[450px] p-4 hover:border border-gray-600 rounded-2xl bg-[rgba(20,20,20,0.9)] hover:bg-[rgba(20,20,20,1)]">
          <h1 className="font-bold text-xl text-center">
            Pomodoro Timer Settings
          </h1>
          <h2 className=" text-center">
            Customize your Pomodoro timer intervals
          </h2>
          <form
            onSubmit={handleSubmitForm}
            className="flex flex-col m-2 items-center"
          >
            <label>Work Duration</label>
            <input
              name="workDuration"
              className="border border-gray-600 mb-[1rem]"
              type="number"
              placeholder="15"
              defaultValue={state.settings.workDuration}
            ></input>

            <label>Short Break</label>
            <input
              name="shortBreak"
              className="border border-gray-600 mb-[1rem]"
              type="number"
              placeholder="5"
              defaultValue={state.settings.shortBreak}
            ></input>

            <label>Long Break</label>
            <input
              name="longBreak"
              className="border border-gray-600 mb-[1rem]"
              type="number"
              placeholder="15"
              defaultValue={state.settings.longBreak}
            ></input>

            <label>Work Interval</label>
            <input
              className="border border-gray-600"
              name="intervalsBeforeLong"
              type="number"
              placeholder="1"
              defaultValue={state.settings.intervalsBeforeLong}
            ></input>

            <button
              type="submit"
              className="text-center border rounded-2xl w-[5rem] absolute bottom-10 left-1/2 -translate-x-1/2 hover:bg-green-800"
            >
              Submit
            </button>
          </form>
        </section>
      )}
    </>
  );
}
