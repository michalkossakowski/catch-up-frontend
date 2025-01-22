import React, { useEffect, useRef } from "react";

const LoadingAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 164; 
    const height = 86;
    canvas.width = width;
    canvas.height = height;

    const lines = [
      { text: "catch", color: "#DB91D1", fontSize: 24, offsetY: 24, offsetX: 4 },
      { text: "(", color: "#FFFFFF", fontSize: 24, offsetY: 24, offsetX: 62 },
      { text: "Up", color: "#5CD3B4", fontSize: 24, offsetY: 24, offsetX: 72 },
      { text: "){", color: "#FFFFFF", fontSize: 24, offsetY: 24, offsetX: 105 },
      { text: "OnBoarding", color: "#F2E267", fontSize: 24, offsetY: 50, offsetX: 34 },
      { text: "}", color: "#FFFFFF", fontSize: 24, offsetY: 76, offsetX: 4 }, 
    ];

    let currentLineIndex = 0;
    let currentCharIndex = 0;
    let animationFrameId: number;
    const charDelay = 60; // Delay in milliseconds between characters
    const loopDelay = 500; // Delay before restarting the animation

    const drawText = () => {
      ctx.clearRect(0, 0, width, height); // Clear the canvas

      // Draw completed lines
      for (let i = 0; i < currentLineIndex; i++) {
        const line = lines[i];
        ctx.font = `${line.fontSize}px Arial`;
        ctx.fillStyle = line.color;
        ctx.textAlign = "left";
        ctx.fillText(line.text, line.offsetX, line.offsetY);
      }

      // Draw the current line, letter by letter
      const line = lines[currentLineIndex];
      const textToDraw = line.text.substring(0, currentCharIndex);
      ctx.font = `${line.fontSize}px Arial`;
      ctx.fillStyle = line.color;
      ctx.textAlign = "left";
      ctx.fillText(textToDraw, line.offsetX, line.offsetY);

      // Increment character index or move to the next line
      if (currentCharIndex < line.text.length) {
        setTimeout(() => {
          currentCharIndex++;
          animationFrameId = requestAnimationFrame(drawText);
        }, charDelay);
      } else if (currentLineIndex < lines.length - 1) {
        currentCharIndex = 0;
        currentLineIndex++;
        setTimeout(() => {
          animationFrameId = requestAnimationFrame(drawText);
        }, charDelay);
      } else {
        // Wait before restarting the animation
        setTimeout(() => {
          currentCharIndex = 0;
          currentLineIndex = 0;
          animationFrameId = requestAnimationFrame(drawText);
        }, loopDelay);
      }
    };

    animationFrameId = requestAnimationFrame(drawText);

    // Clean up animation on component unmount
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        //border: "solid black 1px",
        margin: "auto",
      }}
    />
  );
};

export default LoadingAnimation;
