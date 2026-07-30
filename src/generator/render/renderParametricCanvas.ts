import { sampleImage } from "../core/sampleImage";
import type { GeneratorConfig } from "../types/generator";
import { calculateCanvasSize } from "./calculateCanvasSize";
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

	const { tilesX, tilesY, gap, direction, imageAdjustments, segments } = config;

	const { width: canvasWidth, height: canvasHeight } =
		calculateCanvasSize(image);

	const cellWidth = canvasWidth / tilesX;
	const cellHeight = canvasHeight / tilesY;

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
			cellWidth,
			cellHeight,
			gap,
			luminance: cell.luminance,
			direction,
		});

		context.fillStyle = segments[cell.segment].color;
		context.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
	}
};
