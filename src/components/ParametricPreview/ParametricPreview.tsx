import { useEffect, useRef } from "react";
import { renderParametricCanvas } from "../../generator/render/renderParametricCanvas";
import type { GeneratorConfig } from "../../generator/types/generator";

type ParametricPreviewProps = {
	image: HTMLImageElement | null;
	config: GeneratorConfig;
};

export const ParametricPreview = ({
	image,
	config,
}: ParametricPreviewProps) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;

		if (!canvas || !image) {
			return;
		}

		renderParametricCanvas({
			canvas,
			image,
			config,
		});
	}, [image, config]);

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
