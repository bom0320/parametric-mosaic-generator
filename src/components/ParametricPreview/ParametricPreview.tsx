import { useEffect, useRef } from "react";
import { renderParametricCanvas } from "../../generator/render/renderParametricCanvas";
import type { GeneratorConfig } from "../../generator/types/generator";
import { useParametricAnimation } from "../../hooks/useParametricAnimation";
import { canvasToBlob } from "../../utils/canvasToBlob";
import { createExportFileName } from "../../utils/createExportFileName";
import { downloadBlob } from "../../utils/downloadBlob";

type ParametricPreviewProps = {
	image: HTMLImageElement | null;
	config: GeneratorConfig;
	animationRunId: number;
	onAnimationComplete: () => void;
};

export const ParametricPreview = ({
	image,
	config,
	animationRunId,
	onAnimationComplete,
}: ParametricPreviewProps) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const animationState = useParametricAnimation({
		mode: config.animationMode,
		restartKey: image,
		animationRunId,
		onAnimationComplete,
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

	const handleSavePng = async () => {
		const canvas = canvasRef.current;

		if (!canvas) {
			return;
		}

		try {
			const blob = await canvasToBlob(canvas);

			downloadBlob(blob, createExportFileName("png"));
		} catch (error) {
			console.error("PNG 저장에 실패했습니다.", error);
		}
	};

	if (!image) {
		return null;
	}

	const directionLabel =
		config.direction === "horizontal" ? "Horizontal" : "Vertical";

	return (
		<section className="parametric-preview">
			<div className="parametric-preview-header">
				<div className="parametric-preview-information">
					<h2>Parametric Preview</h2>

					<span>
						{directionLabel} blinds · {config.tilesX} × {config.tilesY}
					</span>
				</div>

				<div className="export-actions">
					<button
						type="button"
						onClick={handleSavePng}
						disabled={animationState.isAnimating}
					>
						Save PNG
					</button>

					<button type="button" disabled>
						Start Recording (ZIP)
					</button>
				</div>
			</div>

			<div className="parametric-canvas-container">
				<canvas ref={canvasRef} className="parametric-canvas" />
			</div>
		</section>
	);
};
