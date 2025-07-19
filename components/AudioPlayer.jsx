import { useEffect, useRef, useState } from "react";

export default function AudioPlayer({ audioState }) {
  const rainRef = useRef(null);
  const waveRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (rainRef.current) {
      rainRef.current.volume =
        typeof audioState.rainSound === "number" ? audioState.rainSound : 0;
    }
    if (waveRef.current) {
      waveRef.current.volume =
        typeof audioState.wave === "number" ? audioState.wave : 0;
    }

    // Allow autoplay after volume is set
    setReady(true);
  }, [audioState.rainSound, audioState.wave]);

  useEffect(() => {
    if (ready) {
      rainRef.current?.play().catch(() => {});
      waveRef.current?.play().catch(() => {});
    }
  }, [ready]);

  return (
    <>
      <audio ref={rainRef} loop preload="auto">
        <source src="/sounds/rain.wav" type="audio/wav" />
      </audio>
      <audio ref={waveRef} loop preload="auto">
        <source src="/sounds/ocean.wav" type="audio/wav" />
      </audio>
    </>
  );
}
