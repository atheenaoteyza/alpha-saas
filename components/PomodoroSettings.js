import TomatoSVG from "@/assets/Tomato";
import { useEffect, useRef, useState } from "react";

export default function PomodoroSettings({ state, dispatch }) {
  const [modal, setModal] = useState(false);
  const modalRef = useRef(null);
  const iconRef = useRef(null);

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
    dispatch({ type: "RESET" });
    setModal(false);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        modal &&
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        iconRef.current &&
        !iconRef.current.contains(event.target)
      ) {
        setModal(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modal]);

  return (
    <>
      {/* Trigger */}
      <div
        ref={iconRef}
        onClick={() => setModal((prev) => !prev)}
        className="p-3 cursor-pointer border border-gray-600 rounded-2xl bg-[rgba(20,20,20,0.7)] hover:bg-[rgba(20,20,20,1)]"
      >
        <div className="flex items-center">
          <TomatoSVG className="h-8 w-8" />
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <section
          ref={modalRef}
          className="absolute left-1/2 top-1/2 max-h-[90vh] w-[90vw] sm:w-[450px] overflow-y-auto transform -translate-x-1/2 -translate-y-1/2
             p-4 hover:border border-gray-600 rounded-2xl 
             bg-[rgba(20,20,20,0.9)] hover:bg-[rgba(20,20,20,1)]"
        >
          <h1 className="font-bold text-xl text-center">
            Pomodoro Timer Settings
          </h1>
          <h2 className="text-center">
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
            />

            <label>Short Break</label>
            <input
              name="shortBreak"
              className="border border-gray-600 mb-[1rem]"
              type="number"
              placeholder="5"
              defaultValue={state.settings.shortBreak}
            />

            <label>Long Break</label>
            <input
              name="longBreak"
              className="border border-gray-600 mb-[1rem]"
              type="number"
              placeholder="15"
              defaultValue={state.settings.longBreak}
            />

            <label>Work Interval</label>
            <input
              className="border border-gray-600"
              name="intervalsBeforeLong"
              type="number"
              placeholder="1"
              defaultValue={state.settings.intervalsBeforeLong}
            />

            <button
              type="submit"
              className="mt-4 text-center border rounded-2xl w-[5rem] hover:bg-green-800"
            >
              Submit
            </button>
          </form>
        </section>
      )}
    </>
  );
}
