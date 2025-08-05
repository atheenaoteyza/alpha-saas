import { FlameIcon } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import DeviceIcon from "@/assets/DeviceIcon";
import SlidersIcon from "@/assets/Equalizer";
import MusicPlayer from "@/components/MusicPlayer";
import { useState, useEffect } from "react";

export default function ToolSection({
  dispatch,
  state,
  audioState,
  audioDispatch,
}) {
  const [streak, setStreak] = useState(0);
  const [isSettings, setIsSettings] = useState("");

  function handleSettingsClick(value) {
    setIsSettings(value);
  }

  useEffect(() => {
    if (!state.isVideo) {
      audioDispatch({
        type: "TOGGLE_RAIN_EFFECT",
        payload: false,
      });
    }
  }, [state.isVideo]);

  useEffect(() => {
    setStreak(state.focusLog?.days?.currentStreak || 0);
  }, [state.focusLog]);

  return (
    <>
      <div
        className="content flex justify-end"
        style={{
          position: "relative",
          zIndex: 20,
          backgroundColor: "rgba(20, 20, 20, 0.7)",
        }}
      >
        <div className="flex m-[1rem] w-full justify-between">
          <div className="p-2">hello</div>

          <div className="w-full flex justify-center items-center">
            <div className="flex streaks p-2 bg-gray-900 border border-gray-600 rounded-2xl">
              <FlameIcon />
              <p className="ml-1"> {`Days Streak : ${streak}`}</p>
            </div>
          </div>
          <div className="p-2 flex">
            <div className=" p-2  hover:border-gray-600 rounded-3xl">
              <SlidersIcon
                onClick={() => handleSettingsClick("volume")}
                className="w-7 h-7"
              ></SlidersIcon>
            </div>
            <div className=" p-2  hover:border-gray-600 rounded-3xl">
              <DeviceIcon
                onClick={() => handleSettingsClick("playlist")}
                className={`w-7 h-7 stroke-none`}
              ></DeviceIcon>
            </div>
            <div className=" p-1 ml-[.5rem]  hover:border-gray-600 rounded-3xl">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: {
                      width: "34px",
                      height: "34px",
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
        {isSettings && (
          <div className="absolute w-[20rem] aspect-square top-20 right-[30px] bg-gray-900 border border-gray-600 rounded-xl shadow-lg p-4">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setIsSettings("")}
                className="text-gray-400 hover:text-white text-xl font-bold"
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <MusicPlayer
              isSettings={isSettings}
              dispatch={dispatch}
              state={state}
              audioState={audioState}
              audioDispatch={audioDispatch}
            />
          </div>
        )}
      </div>
    </>
  );
}
