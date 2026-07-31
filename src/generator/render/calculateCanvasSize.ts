import { getSourceDimensions } from "../core/getSourceDimensions";
import type { VisualSource } from "../types/source";

type CanvasSize = {
	width: number;
	height: number;
};

const MAX_CANVAS_WIDTH = 960;
const MAX_CANVAS_HEIGHT = 720;

export const calculateCanvasSize = (source: VisualSource): CanvasSize => {
	const { width: sourceWidth, height: sourceHeight } =
		getSourceDimensions(source);

	if (sourceWidth <= 0 || sourceHeight <= 0) {
		throw new Error("Source dimensions must be greater than zero.");
	}

	const scale = Math.min(
		MAX_CANVAS_WIDTH / sourceWidth,
		MAX_CANVAS_HEIGHT / sourceHeight,
		1,
	);

	return {
		width: Math.round(sourceWidth * scale),
		height: Math.round(sourceHeight * scale),
	};
};
