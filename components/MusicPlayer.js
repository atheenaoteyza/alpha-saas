import {
  PlusIcon,
  Volume1,
  VolumeX,
  SunriseIcon,
  BirdIcon,
  BookOpen,
  CloudHail,
} from "lucide-react";
import { useState } from "react";

export default function MusicPlayer({ dispatch, state, isSettings }) {
  const [url, setUrl] = useState("");

  const seanStudy = "GSep96CLsgo";
  const seasideLofi = "gUbNlN_SqpE";
  const lofiGirl = "jfKfPfyJRdk";
  const rainLofi = "vYIYIVmOo3Q";

  function extractYouTubeId(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get("v");
    } catch (e) {
      return null;
    }
  }

  function handleAddVideo(e) {
    e.preventDefault();
    const id = extractYouTubeId(url);
    if (id) {
      dispatch({ type: "CHANGE_VIDEO_ID", payload: id });
    } else {
      alert("Please enter a valid YouTube URL");
    }
  }

  return (
    <div className="modal w-full flex flex-col justify-center items-center overflow-auto text-center">
      <div className="w-full">
        {isSettings === "volume" && (
          <>
            <h1 className="text-lg font-semibold mb-4">Volume Settings</h1>
            <div className="p-4">
              <label htmlFor="volume" className="block mb-2">
                Volume:
              </label>
              <input
                id="volume"
                type="range"
                min="0"
                max="1"
                step="0.01"
                disabled={state.isMuted}
                value={state.volume}
                onChange={(e) =>
                  dispatch({
                    type: "SET_VOLUME",
                    payload: parseFloat(e.target.value),
                  })
                }
              />
            </div>
          </>
        )}
        {isSettings === "playlist" && (
          <>
            <h1 className="text-lg font-semibold mb-4">Playlist Settings</h1>
            <div className="flex gap-1">
              <button
                onClick={() =>
                  dispatch({
                    type: "CHANGE_VIDEO_ID",
                    payload: seanStudy,
                  })
                }
                className="bg-[#3F3351] text-white border rounded-full border-gray-600 w-full mb-[1rem] flex items-center justify-center p-2 hover:bg-[#2E243A] transition"
              >
                <SunriseIcon></SunriseIcon>
              </button>
              <button
                onClick={() =>
                  dispatch({
                    type: "CHANGE_VIDEO_ID",
                    payload: seasideLofi,
                  })
                }
                className="bg-[#B3305E] text-white border rounded-full border-gray-600 w-full mb-[1rem] flex items-center justify-center p-2 hover:bg-[#8A254A] transition"
              >
                <BirdIcon></BirdIcon>
              </button>
              <button
                onClick={() =>
                  dispatch({
                    type: "CHANGE_VIDEO_ID",
                    payload: lofiGirl,
                  })
                }
                className="bg-[#0D4D4D] text-white border rounded-full border-gray-600 w-full mb-[1rem] flex items-center justify-center p-2 hover:bg-[#083636] transition"
              >
                <BookOpen />
              </button>
              <button
                onClick={() =>
                  dispatch({
                    type: "CHANGE_VIDEO_ID",
                    payload: rainLofi,
                  })
                }
                className="bg-[#1E1E2E] text-white border rounded-full border-gray-600 w-full mb-[1rem] flex items-center justify-center p-2 hover:bg-[#13131A] transition"
              >
                <CloudHail />
              </button>
            </div>
            {/* Form */}
            <form
              onSubmit={handleAddVideo}
              className="border border-gray-600 rounded-lg p-2 mb-4"
            >
              <input
                placeholder="Paste YouTube URL here"
                className="bg-transparent w-full outline-none text-white text-center placeholder-gray-500"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </form>

            {/* Add Button */}
            <button
              onClick={handleAddVideo}
              className="bg-[#865DFF] text-white border rounded-xl border-gray-600 w-full mb-[1rem] flex items-center justify-center p-2 hover:bg-[#6846CC] transition"
            >
              <PlusIcon className="mr-2" />
              Add YouTube Custom
            </button>
          </>
        )}

        <div className="border-t border-gray-700 mb-4"></div>

        {/* Mute / Unmute */}
        <button
          type="button"
          onClick={() => dispatch({ type: "TOGGLE_MUTE" })}
          className="text-gray-400 hover:text-white cursor-pointer transition mt-2 mx-auto"
          aria-label={state.isMuted ? "Un‑mute" : "Mute"}
        >
          {state.isMuted || state.volume === 0 ? (
            <VolumeX size={24} />
          ) : (
            <Volume1 size={24} />
          )}
        </button>
      </div>
    </div>
  );
}
