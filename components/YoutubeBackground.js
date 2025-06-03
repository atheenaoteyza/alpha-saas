import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player/youtube"), {
  ssr: false,
});

export default function YoutubeBackground({ isMuted }) {
  const videoId = "HQwLPhE2zys"; // Default YouTube link
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  return (
    <>
      <ReactPlayer
        url={videoUrl}
        playing={true}
        muted={isMuted}
        loop={true}
        width="100%"
        height="110%"
        style={{
          position: "fixed",
          top: -60,
          left: 0,
          pointerEvents: "none",
          zIndex: -1,
        }}
        config={{
          youtube: {
            playerVars: {
              showinfo: 0,
              modestbranding: 1,
              fs: 0,
              iv_load_policy: 3,
              cc_load_policy: 0,
              disablekb: 1,
              rel: 0,
              vq: "hd1080",
              controls: 0,
            },
          },
        }}
      />
    </>
  );
}
