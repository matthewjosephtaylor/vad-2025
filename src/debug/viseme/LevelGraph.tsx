import React, { useEffect, useRef, useState } from "react";

interface LevelGraphProps {
  name: string;
  value: number;
}

const LevelGraph: React.FC<LevelGraphProps> = ({ name, value }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Track the dynamic range for scaling
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(1);

  useEffect(() => {
    if (!value) {
      return;
    }
    // Auto-balance the range by updating min and max based on the current value
    if (value < minValue) setMinValue(value);
    if (value > maxValue) setMaxValue(value);
  }, [value, minValue, maxValue]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (ctx) {
        // Shift the existing data left
        const imageData = ctx.getImageData(
          1,
          0,
          canvas.width - 1,
          canvas.height
        );
        ctx.putImageData(imageData, 0, 0);

        // Clear the rightmost column
        ctx.clearRect(canvas.width - 1, 0, 1, canvas.height);

        // Normalize value to the current range [minValue, maxValue]
        const range = maxValue - minValue || 1; // Avoid division by 0
        const normalizedValue = (value - minValue) / range;

        // Draw the new viseme value (normalized to canvas height)
        const height = canvas.height - normalizedValue * canvas.height;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(canvas.width - 2, height);
        ctx.lineTo(canvas.width - 1, height);
        ctx.strokeStyle = "green";
        ctx.stroke();
      }
    }
  }, [value, minValue, maxValue]);

  return (
    <div>
      <h4>{name}</h4>
      <canvas ref={canvasRef} width={300} height={100} />
      <p>
        Min: {minValue.toFixed(2)} | Max: {maxValue.toFixed(2)} | Current:{" "}
        {value.toFixed(2)}
      </p>
    </div>
  );
};

export default LevelGraph;
