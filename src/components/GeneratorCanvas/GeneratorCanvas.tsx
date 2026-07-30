import { useEffect, useRef } from "react";
import { calculateCanvasSize } from "../../generator/render/calculateCanvasSize";

type GeneratorCanvasProps = {
  image: HTMLImageElement | null;
};

export const GeneratorCanvas = ({ image }: GeneratorCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    if (!image) {
      return;
    }

    const { width, height } = calculateCanvasSize(image);

    canvas.width = width;
    canvas.height = height;

    context.drawImage(image, 0, 0, width, height);
  }, [image]);

  return (
    <div className="canvas-container">
      {!image && (
        <p className="canvas-placeholder">
          이미지를 선택하면 여기에 표시됩니다.
        </p>
      )}

      <canvas
        ref={canvasRef}
        className={image ? "generator-canvas" : "generator-canvas is-empty"}
      />
    </div>
  );
};
