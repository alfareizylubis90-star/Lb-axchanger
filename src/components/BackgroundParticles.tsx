import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  alpha: number;
  decay: number;
}

export default function BackgroundParticles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0 || dimensions.height === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const particles: Particle[] = [];
    const particleCount = Math.min(45, Math.floor((dimensions.width * dimensions.height) / 30000));

    const colors = [
      "rgba(0, 255, 136, 0.3)", // neon green
      "rgba(255, 215, 0, 0.25)", // gold
      "rgba(0, 255, 136, 0.15)",
      "rgba(255, 215, 0, 0.12)",
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: Math.random() * 3.5 + 1.5,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: (Math.random() - 0.6) * 0.45, // drift upwards slightly
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.2,
        decay: Math.random() * 0.002 + 0.001,
      });
    }

    let animationFrameId: number;

    const drawParticles = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      // Draw elegant glowing ambient background blurs
      const grad1 = ctx.createRadialGradient(
        dimensions.width * 0.2,
        dimensions.height * 0.2,
        50,
        dimensions.width * 0.2,
        dimensions.height * 0.2,
        dimensions.width * 0.5
      );
      grad1.addColorStop(0, "rgba(0, 255, 136, 0.03)");
      grad1.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      const grad2 = ctx.createRadialGradient(
        dimensions.width * 0.8,
        dimensions.height * 0.7,
        100,
        dimensions.width * 0.8,
        dimensions.height * 0.7,
        dimensions.width * 0.6
      );
      grad2.addColorStop(0, "rgba(255, 215, 0, 0.02)");
      grad2.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // Render actual particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around boundaries
        if (p.x < 0) p.x = dimensions.width;
        if (p.x > dimensions.width) p.x = 0;
        if (p.y < 0) p.y = dimensions.height;
        if (p.y > dimensions.height) p.y = dimensions.height;

        // Smooth alpha cycle
        p.alpha += p.speedX > 0 ? 0.002 : -0.002;
        if (p.alpha <= 0.1) p.alpha = 0.1;
        if (p.alpha >= 0.7) p.alpha = 0.7;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = p.size * 2;
        ctx.shadowColor = p.color;
        ctx.fill();
      });

      ctx.shadowBlur = 0; // reset shadow
      animationFrameId = requestAnimationFrame(drawParticles);
    };

    drawParticles();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [dimensions]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-transparent"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
