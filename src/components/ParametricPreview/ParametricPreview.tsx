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

	return (
		<section className="parametric-preview">
			<div className="parametric-preview-header">
				<h2>Parametric Preview</h2>

				<span>
					{config.mode === "width" ? "Width" : "Height"} mode · {config.columns}{" "}
					× {config.rows}
				</span>
			</div>

			<div className="parametric-canvas-container">
				<canvas ref={canvasRef} className="parametric-canvas" />
			</div>
		</section>
	);
};
