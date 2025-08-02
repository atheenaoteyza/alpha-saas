import dynamic from "next/dynamic";
import { useMemo } from "react";
import RainEffectReactStyle from "./Rain";

const ReactPlayer = dynamic(() => import("react-player/youtube"), {
  ssr: false,
});

export default function YoutubeBackground({ state, audioState }) {
  const videoId = state.videoId; // Default YouTube link

  const shouldShowRain = useMemo(
    () => audioState.rain !== 0,
    [audioState.rain]
  );
  const rainDropCount = useMemo(() => audioState.rain * 500, [audioState.rain]);
  return (
    <div className="fixed inset-0 z-[-1] flex justify-center items-center overflow-hidden pointer-events-none">
      {" "}
      <div className="w-full max-w-[100vw] aspect-video relative">
        {" "}
        <ReactPlayer
          key={`${videoId}-${state.restartVideo}`}
          volume={state.volume}
          url={`https://www.youtube.com/watch?v=${videoId}`}
          playing
          muted={state.isMuted}
          loop
          width="100%"
          height="100%"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
          }}
          config={{
            youtube: {
              playerVars: {
                playlist: videoId,
                loop: 1,
                modestbranding: 1,
                showinfo: 0,
                controls: 0,
                rel: 0,
                fs: 0,
                disablekb: 1,
                iv_load_policy: 3,
                cc_load_policy: 0,
                vq: "hd1080",
              },
            },
          }}
        />
        {audioState.rainEffect && shouldShowRain && (
          <div
            className="absolute top-0 left-20 w-full h-full z-10"
            style={{
              clipPath: "inset(0 0 0 0)", // Only shows inside this div
              WebkitClipPath: "inset(0 0 0 0)",
              overflow: "hidden",
            }}
          >
            <RainEffectReactStyle dropCount={rainDropCount} />
          </div>
        )}
      </div>
    </div>
  );
}
