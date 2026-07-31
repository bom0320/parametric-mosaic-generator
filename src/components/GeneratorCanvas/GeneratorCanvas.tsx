import { useEffect, useRef } from "react";
import { calculateCanvasSize } from "../../generator/render/calculateCanvasSize";
import { isVideoSource, type VisualSource } from "../../generator/types/source";

type GeneratorCanvasProps = {
	source: VisualSource;
};

export const GeneratorCanvas = ({ source }: GeneratorCanvasProps) => {
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

		const { width, height } = calculateCanvasSize(source);

		canvas.width = width;
		canvas.height = height;

		let animationFrameId = 0;

		const renderFrame = () => {
			context.clearRect(0, 0, width, height);
			context.drawImage(source, 0, 0, width, height);

			if (isVideoSource(source)) {
				animationFrameId = requestAnimationFrame(renderFrame);
			}
		};

		renderFrame();

		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	}, [source]);

	return (
		<div className="canvas-container">
			<canvas ref={canvasRef} className="generator-canvas" />
		</div>
	);
};
