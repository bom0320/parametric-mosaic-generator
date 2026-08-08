import { useEffect, useRef, useState } from "react";

import { calculateCanvasSize } from "../../generator/render/calculateCanvasSize";
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

		const { width, height } = calculateCanvasSize({
			source,
			viewportWidth: viewportSize.width,
			viewportHeight: viewportSize.height,
		});

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
	}, [source, viewportSize.width, viewportSize.height]);

	return (
		<div ref={containerRef} className="canvas-container">
			<canvas ref={canvasRef} className="generator-canvas" />
		</div>
	);
};
