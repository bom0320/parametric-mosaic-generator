import { useEffect, useRef, useState } from "react";

import { getSourceDimensions } from "../../generator/core/getSourceDimensions";
import { isVideoSource, type VisualSource } from "../../generator/types/source";

type GeneratorCanvasProps = {
	source: VisualSource;
};

type ViewportSize = {
	width: number;
	height: number;
};

export const GeneratorCanvas = ({ source }: GeneratorCanvasProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const [viewportSize, setViewportSize] = useState<ViewportSize>({
		width: 0,
		height: 0,
	});

	useEffect(() => {
		const container = containerRef.current;

		if (!container) {
			return;
		}

		const updateSize = () => {
			setViewportSize({
				width: container.clientWidth,
				height: container.clientHeight,
			});
		};

		updateSize();

		const resizeObserver = new ResizeObserver(updateSize);

		resizeObserver.observe(container);

		return () => {
			resizeObserver.disconnect();
		};
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;

		if (!canvas || viewportSize.width <= 0 || viewportSize.height <= 0) {
			return;
		}

		const context = canvas.getContext("2d");

		if (!context) {
			return;
		}

		const canvasWidth = Math.round(viewportSize.width);
		const canvasHeight = Math.round(viewportSize.height);

		canvas.width = canvasWidth;
		canvas.height = canvasHeight;

		const { width: sourceWidth, height: sourceHeight } =
			getSourceDimensions(source);

		if (sourceWidth <= 0 || sourceHeight <= 0) {
			return;
		}

		const scale = Math.max(
			canvasWidth / sourceWidth,
			canvasHeight / sourceHeight,
		);

		const drawWidth = sourceWidth * scale;
		const drawHeight = sourceHeight * scale;

		const drawX = (canvasWidth - drawWidth) / 2;
		const drawY = (canvasHeight - drawHeight) / 2;

		let animationFrameId = 0;

		const renderFrame = () => {
			context.clearRect(0, 0, canvasWidth, canvasHeight);

			context.drawImage(source, drawX, drawY, drawWidth, drawHeight);

			if (isVideoSource(source)) {
				animationFrameId = requestAnimationFrame(renderFrame);
			}
		};

		renderFrame();

		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	}, [source, viewportSize.width, viewportSize.height]);

	return (
		<div ref={containerRef} className="canvas-container">
			<canvas ref={canvasRef} className="generator-canvas" />
		</div>
	);
};
