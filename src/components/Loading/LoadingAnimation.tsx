import React, { useEffect, useRef } from "react";

const LoadingAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 100;
    const height = 50;
    canvas.width = width;
    canvas.height = height;

    const text = "catchUp";
    let currentCharIndex = 0;
    let removing = false;
    let animationFrameId: number;
    const charDelay = 40;
    const loopDelay = 500;
    const theme = localStorage.getItem('theme') as 'night' | 'day' | null;

    const drawText = () => {
      ctx.clearRect(0, 0, width, height);

      const textToDraw = text.substring(0, currentCharIndex);
      ctx.font = "24px Arial";
      ctx.fillStyle = theme === 'day' ? "black" : "white";
      ctx.textAlign = "left";
      ctx.fillText(textToDraw, 6, 30);

      if (!removing) {
        if (currentCharIndex < text.length) {
          setTimeout(() => {
            currentCharIndex++;
            animationFrameId = requestAnimationFrame(drawText);
          }, charDelay);
        } else {
          setTimeout(() => {
            removing = true;
            animationFrameId = requestAnimationFrame(drawText);
          }, loopDelay);
        }
      } else {
        if (currentCharIndex > 0) {
          setTimeout(() => {
            currentCharIndex--;
            animationFrameId = requestAnimationFrame(drawText);
          }, charDelay);
        } else {
          setTimeout(() => {
            removing = false;
            animationFrameId = requestAnimationFrame(drawText);
          }, loopDelay);
        }
      }
    };

    animationFrameId = requestAnimationFrame(drawText);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return <canvas ref={canvasRef} style={{ display: "block", margin: "auto" }} />;
};

export default LoadingAnimation;