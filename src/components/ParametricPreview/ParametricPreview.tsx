import { useEffect, useRef } from "react";
import { sampleImage } from "../../generator/core/sampleImage";
import { segmentStyleMap } from "../../generator/core/segmentStyleMap";
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

		const context = canvas.getContext("2d");

		if (!context) {
			return;
		}

		const { columns, rows, cellSize, gap, mode } = config;

		const canvasWidth = columns * cellSize;
		const canvasHeight = rows * cellSize;

		canvas.width = canvasWidth;
		canvas.height = canvasHeight;

		context.clearRect(0, 0, canvasWidth, canvasHeight);

		context.fillStyle = "#f5f1e8";
		context.fillRect(0, 0, canvasWidth, canvasHeight);

		const cells = sampleImage(image, {
			columns,
			rows,
		});

		for (const cell of cells) {
			const style = segmentStyleMap[cell.segment];
			const availableSize = Math.max(cellSize - gap, 0);

			const shapeWidth =
				mode === "width" ? availableSize * style.scale : availableSize;

			const shapeHeight =
				mode === "height" ? availableSize * style.scale : availableSize;

			const cellX = cell.column * cellSize;
			const cellY = cell.row * cellSize;

			const shapeX = cellX + (cellSize - shapeWidth) / 2;
			const shapeY = cellY + (cellSize - shapeHeight) / 2;

			context.fillStyle = style.color;
			context.fillRect(shapeX, shapeY, shapeWidth, shapeHeight);
		}
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
