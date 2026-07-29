import { useEffect, useRef } from "react";
import { sampleImage } from "../../generator/core/sampleImage";
import { segmentStyleMap } from "../../generator/core/segmentColorMap";

type ParametricPreviewProps = {
	image: HTMLImageElement | null;
	columns?: number;
	rows?: number;
	cellSize?: number;
	gap?: number;
};

export const ParametricPreview = ({
	image,
	columns = 60,
	rows = 40,
	cellSize = 12,
	gap = 2,
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

		const width = columns * cellSize;
		const height = rows * cellSize;

		canvas.width = width;
		canvas.height = height;

		context.clearRect(0, 0, width, height);
		context.fillStyle = "#f5f1e8";
		context.fillRect(0, 0, width, height);

		const cells = sampleImage(image, {
			columns,
			rows,
		});

		for (const cell of cells) {
			const style = segmentStyleMap[cell.segment];

			const availableSize = cellSize - gap;
			const shapeWidth = availableSize * style.scale;
			const shapeHeight = availableSize;

			const cellX = cell.column * cellSize;
			const cellY = cell.row * cellSize;

			const shapeX = cellX + (cellSize - shapeWidth) / 2;
			const shapeY = cellY + gap / 2;

			context.fillStyle = style.color;
			context.fillRect(shapeX, shapeY, shapeWidth, shapeHeight);
		}
	}, [image, columns, rows, cellSize, gap]);

	if (!image) {
		return null;
	}

	return (
		<section className="parametric-preview">
			<div className="parametric-preview-header">
				<h2>Parametric Preview</h2>

				<span>
					Width mode · {columns} × {rows}
				</span>
			</div>

			<div className="parametric-canvas-container">
				<canvas ref={canvasRef} className="parametric-canvas" />
			</div>
		</section>
	);
};
