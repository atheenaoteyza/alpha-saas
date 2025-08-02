import { useReducer, lazy, Suspense } from "react";
import ToolSection from "@/components/ToolSection";
import { Geist, Geist_Mono } from "next/font/google";
import Pomodoro from "@/components/Pomodoro";
import { lofiReducer, lofiInitialState } from "@/reducers/appReducer";
import AudioPlayer from "@/components/AudioPlayer";
import { audioInitialState, audioReducer } from "@/reducers/audioReducer";

// Lazy load YoutubeBackground only
const YoutubeBackground = lazy(() => import("@/components/YoutubeBackground"));

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export default function DashBoard() {
  const [state, dispatch] = useReducer(lofiReducer, lofiInitialState);
  const [audioState, audioDispatch] = useReducer(
    audioReducer,
    audioInitialState
  );

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} youtube-background`}
    >
      <Suspense
        fallback={
          <div className="bg-gradient-to-br from-gray-900 to-black w-full h-full fixed inset-0" />
        }
      >
        <YoutubeBackground state={state} audioState={audioState} />
      </Suspense>

      <AudioPlayer audioState={audioState} />

      <div className="flex flex-col justify-between">
        <section>
          <ToolSection
            dispatch={dispatch}
            state={state}
            audioState={audioState}
            audioDispatch={audioDispatch}
          />
        </section>

        <div className="h-[85vh] flex justify-center items-end">
          <section className="flex flex-col items-center justify-center w-[40%] h-[30%] p-[2rem]">
            <div className={state.isMuted ? "text-white" : "text-transparent"}>
              Ready to go?
            </div>
            <Pomodoro state={state} dispatch={dispatch} />
          </section>
        </div>
      </div>
    </div>
  );
}
