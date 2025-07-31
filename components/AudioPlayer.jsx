import { useEffect, useRef, useState } from "react";

export default function AudioPlayer({ audioState }) {
  const rainRef = useRef(null);
  const waveRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

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
    if (!ready || !hasInteracted) return;

    rainRef.current?.play().catch(console.error);
    waveRef.current?.play().catch(console.error);
  }, [ready, hasInteracted]);

  //Listen for the first user interaction
  useEffect(() => {
    const handleInteraction = () => {
      setHasInteracted(true);
      window.removeEventListener("click", handleInteraction);
    };

    window.addEventListener("click", handleInteraction);
    return () => window.removeEventListener("click", handleInteraction);
  }, []);

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
