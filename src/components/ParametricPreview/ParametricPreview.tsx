import { type RefObject, useEffect, useRef, useState } from "react";

import { renderParametricCanvas } from "../../generator/render/renderParametricCanvas";
import type { GeneratorConfig } from "../../generator/types/generator";
import { isVideoSource, type VisualSource } from "../../generator/types/source";
import { useParametricAnimation } from "../../hooks/useParametricAnimation";

type ParametricPreviewProps = {
	source: VisualSource | null;
	config: GeneratorConfig;
	animationRunId: number;
	canvasRef: RefObject<HTMLCanvasElement | null>;
};

type ViewportSize = {
	width: number;
	height: number;
};

export const ParametricPreview = ({
	source,
	config,
	animationRunId,
	canvasRef,
}: ParametricPreviewProps) => {
	const containerRef = useRef<HTMLDivElement>(null);

	const [viewportSize, setViewportSize] = useState<ViewportSize>({
		width: 0,
		height: 0,
	});

	const animationState = useParametricAnimation({
		mode: config.animationMode,
		restartKey: source,
		animationRunId,
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

		if (
			!canvas ||
			!source ||
			viewportSize.width <= 0 ||
			viewportSize.height <= 0
		) {
			return;
		}

		let animationFrameId = 0;

		const renderFrame = () => {
			renderParametricCanvas({
				canvas,
				image: source,
				config,
				animationProgress: animationState.progress,
				isAnimating: animationState.isAnimating,
				viewportWidth: viewportSize.width,
				viewportHeight: viewportSize.height,
			});

			if (isVideoSource(source)) {
				animationFrameId = requestAnimationFrame(renderFrame);
			}
		};

		renderFrame();

		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	}, [
		source,
		config,
		animationState.progress,
		animationState.isAnimating,
		viewportSize.width,
		viewportSize.height,
		canvasRef,
	]);

	if (!source) {
		return null;
	}

	return (
		<section className="parametric-preview">
			<div ref={containerRef} className="parametric-canvas-container">
				<canvas ref={canvasRef} className="parametric-canvas" />
			</div>
		</section>
	);
};
