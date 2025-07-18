import { useEffect, useRef, useState } from "react";
export default function AudioPlayer({ audioState }) {
  const rainRef = useRef(null);

  useEffect(() => {
    if (rainRef.current) {
      rainRef.current.volume = audioState.rain;
    }
  }, [audioState]);
  return (
    <>
      <audio ref={rainRef} autoPlay loop>
        <source src="/sounds/rain.wav" type="audio/wav" />
      </audio>
    </>
  );
}
