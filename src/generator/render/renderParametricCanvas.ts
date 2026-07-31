import { calculateAnimatedSweepScale } from "./../core/calculateAnimatedRowScale";
import { findLuminanceStep } from "../core/findLuminanceStep";
import { sampleImage } from "../core/sampleImage";
import type { GeneratorConfig } from "../types/generator";
import type { VisualSource } from "../types/source";
import { calculateCanvasSize } from "./calculateCanvasSize";
import { calculateShapeBounds } from "./calculateShapeBounds";

type RenderParametricCanvasOptions = {
	canvas: HTMLCanvasElement;
	image: VisualSource;
	config: GeneratorConfig;
	animationProgress: number;
	isAnimating: boolean;
};

const CANVAS_BACKGROUND_COLOR = "#ffffff";
const CELL_OVERLAP = 0.5;

export const renderParametricCanvas = ({
	canvas,
	image,
	config,
	animationProgress,
	isAnimating,
}: RenderParametricCanvasOptions): void => {
	const context = canvas.getContext("2d");

	if (!context) {
		throw new Error("Failed to create a 2D canvas context.");
	}

	const { tilesX, tilesY, gap, direction, imageAdjustments, palette } = config;

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
		const step = findLuminanceStep(cell.luminance);

		const sweepIndex = direction === "horizontal" ? cell.row : cell.column;

		const sweepItemCount = direction === "horizontal" ? tilesY : tilesX;

		const animatedScale = isAnimating
			? calculateAnimatedSweepScale({
					baseScale: step.scale,
					cycleProgress: animationProgress,
					itemIndex: sweepIndex,
					totalItems: sweepItemCount,
				})
			: step.scale * animationProgress;

		const bounds = calculateShapeBounds({
			column: cell.column,
			row: cell.row,
			cellWidth,
			cellHeight,
			gap,
			scale: animatedScale,
			direction,
		});

		if (bounds.width <= 0 || bounds.height <= 0) {
			continue;
		}

		context.fillStyle = palette[step.paletteKey];

		if (direction === "vertical") {
			context.fillRect(
				bounds.x,
				bounds.y - CELL_OVERLAP / 2,
				bounds.width,
				bounds.height + CELL_OVERLAP,
			);

			continue;
		}

		context.fillRect(
			bounds.x - CELL_OVERLAP / 2,
			bounds.y,
			bounds.width + CELL_OVERLAP,
			bounds.height,
		);
	}
};
