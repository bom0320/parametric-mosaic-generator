import { calculateAnimatedRowScale } from "../core/calculateAnimatedRowScale";
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

		const animatedScale = isAnimating
			? calculateAnimatedRowScale({
					baseScale: step.scale,
					cycleProgress: animationProgress,
					row: cell.row,
					totalRows: tilesY,
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

		context.fillStyle = palette[step.paletteKey];

		context.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
	}
};
