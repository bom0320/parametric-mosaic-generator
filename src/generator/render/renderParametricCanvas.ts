import { sampleImage } from "../core/sampleImage";
import type { GeneratorConfig } from "../types/generator";
import { calculateShapeBounds } from "./calculateShapeBounds";

type RenderParametricCanvasOptions = {
	canvas: HTMLCanvasElement;
	image: HTMLImageElement;
	config: GeneratorConfig;
};

const CANVAS_BACKGROUND_COLOR = "#f5f1e8";

export const renderParametricCanvas = ({
	canvas,
	image,
	config,
}: RenderParametricCanvasOptions): void => {
	const context = canvas.getContext("2d");

	if (!context) {
		throw new Error("Failed to create a 2D canvas context.");
	}

	const {
		tilesX,
		tilesY,
		cellSize,
		gap,
		direction,
		imageAdjustments,
		segments,
	} = config;

	const canvasWidth = tilesX * cellSize;
	const canvasHeight = tilesY * cellSize;

	canvas.width = canvasWidth;
	canvas.height = canvasHeight;

	context.clearRect(0, 0, canvasWidth, canvasHeight);

	context.fillStyle = CANVAS_BACKGROUND_COLOR;
	context.fillRect(0, 0, canvasWidth, canvasHeight);

	const cells = sampleImage(image, {
		columns: tilesX,
		rows: tilesY,
		adjustments: imageAdjustments,
	});

	for (const cell of cells) {
		const bounds = calculateShapeBounds({
			column: cell.column,
			row: cell.row,
			cellSize,
			gap,
			luminance: cell.luminance,
			direction,
		});

		context.fillStyle = segments[cell.segment].color;
		context.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
	}
};
