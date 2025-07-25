import dynamic from "next/dynamic";
import { useState, useEffect, useMemo } from "react";

const ReactPlayer = dynamic(() => import("react-player/youtube"), {
  ssr: false,
});

export default function YoutubeBackground({ state, audioState }) {
  const videoId = state.videoId; // Default YouTube link
  let videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const [RainComponent, setRainComponent] = useState(null);

  // Load rain component dynamically
  useEffect(() => {
    if (audioState.rain !== 0) {
      // Import both CSS and component when needed
      Promise.all([
        import("react-rain-animation/lib/style.css"),
        import("react-rain-animation"),
      ])
        .then(([_, module]) => {
          setRainComponent(() => module.default);
        })
        .catch((err) => {
          console.error("Failed to load rain animation:", err);
        });
    }
  }, [audioState.rain]);

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
        {audioState.rainEffect && shouldShowRain && RainComponent && (
          <div
            className="absolute top-0 left-20 w-full h-full z-10"
            style={{
              clipPath: "inset(0 0 0 0)", // Only shows inside this div
              WebkitClipPath: "inset(0 0 0 0)",
              overflow: "hidden",
            }}
          >
            <RainComponent numDrops={rainDropCount} />
          </div>
        )}
      </div>
    </div>
  );
}
