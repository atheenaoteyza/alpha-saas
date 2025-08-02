import React, { useRef, useEffect, useState } from "react";

const RainEffectReactStyle = ({ dropCount }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const drops = useRef([]);

  const [isRaining, setIsRaining] = useState(true);
  // const [dropCount, setDropCount] = useState(200);
  const [dropOpacity, setDropOpacity] = useState(0.5);

  class Raindrop {
    constructor(width, height) {
      this.reset(width, height);
    }

    reset(width, height) {
      this.x = Math.random() * width;
      this.y = Math.random() * -height;
      this.length = 35 + Math.random() * 12;
      this.speed = 20 + Math.random() * 20;
      this.opacity = dropOpacity; // Use state
      this.color = `rgba(173, 216, 230, ${this.opacity})`;
      this.xDrift = Math.random() * 0.5 - 0.25;
      this.lineWidth = 1.0 + Math.random() * 1.2;
      this.glow = Math.random() < 0.5;
    }

    update(height) {
      this.y += this.speed;
      this.x += this.xDrift;
      if (this.y > height) {
        this.reset(window.innerWidth, height);
      }
    }

    draw(ctx) {
      const gradient = ctx.createLinearGradient(
        this.x,
        this.y,
        this.x,
        this.y + this.length
      );
      gradient.addColorStop(0, this.color);
      gradient.addColorStop(1, "rgba(173,216,230,0)");

      ctx.strokeStyle = gradient;
      ctx.lineWidth = this.lineWidth;

      if (this.glow) {
        ctx.shadowBlur = 6;
        ctx.shadowColor = "rgba(173,216,230,0.6)";
      } else {
        ctx.shadowBlur = 0;
        ctx.shadowColor = "transparent";
      }

      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x, this.y + this.length);
      ctx.stroke();
    }
  }

  const initRain = () => {
    drops.current = [];
    for (let i = 0; i < dropCount; i++) {
      drops.current.push(new Raindrop(window.innerWidth, window.innerHeight));
    }
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initRain();
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drops.current.forEach((drop) => {
      drop.update(canvas.height);
      drop.draw(ctx);
    });

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  useEffect(() => {
    const currentCount = drops.current.length;

    if (dropCount > currentCount) {
      const toAdd = dropCount - currentCount;
      for (let i = 0; i < toAdd; i++) {
        drops.current.push(new Raindrop(window.innerWidth, window.innerHeight));
      }
    } else if (dropCount < currentCount) {
      drops.current = drops.current.slice(0, dropCount);
    }
  }, [dropCount]);

  useEffect(() => {
    if (isRaining) {
      animate();
    } else {
      cancelAnimationFrame(animationRef.current);
    }

    return () => cancelAnimationFrame(animationRef.current);
  }, [isRaining]);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 5,
        }}
      />
    </div>
  );
};

export default RainEffectReactStyle;
