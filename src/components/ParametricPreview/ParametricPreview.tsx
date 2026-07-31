import { useEffect, useRef } from "react";
import { renderParametricCanvas } from "../../generator/render/renderParametricCanvas";
import type { GeneratorConfig } from "../../generator/types/generator";
import { useParametricAnimation } from "../../hooks/useParametricAnimation";

type ParametricPreviewProps = {
	image: HTMLImageElement | null;
	config: GeneratorConfig;
	animationRunId: number;
};

export const ParametricPreview = ({
	image,
	config,
	animationRunId,
}: ParametricPreviewProps) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const animationState = useParametricAnimation({
		mode: config.animationMode,
		restartKey: image,
		animationRunId,
	});

	useEffect(() => {
		const canvas = canvasRef.current;

		if (!canvas || !image) {
			return;
		}

		renderParametricCanvas({
			canvas,
			image,
			config,
			animationProgress: animationState.progress,
			isAnimating: animationState.isAnimating,
		});
	}, [image, config, animationState]);

	if (!image) {
		return null;
	}

	const directionLabel =
		config.direction === "horizontal" ? "Horizontal" : "Vertical";

	return (
		<section className="parametric-preview">
			<div className="parametric-preview-header">
				<h2>Parametric Preview</h2>

				<span>
					{directionLabel} blinds · {config.tilesX} × {config.tilesY}
				</span>
			</div>

			<div className="parametric-canvas-container">
				<canvas ref={canvasRef} className="parametric-canvas" />
			</div>
		</section>
	);
};
