import { getSourceDimensions } from "../core/getSourceDimensions";
import type { VisualSource } from "../types/source";

type CanvasSize = {
	width: number;
	height: number;
};

type CalculateCanvasSizeOptions = {
	source: VisualSource;
	viewportWidth: number;
	viewportHeight: number;
};

export const calculateCanvasSize = ({
	source,
	viewportWidth,
	viewportHeight,
}: CalculateCanvasSizeOptions): CanvasSize => {
	const { width: sourceWidth, height: sourceHeight } =
		getSourceDimensions(source);

	if (sourceWidth <= 0 || sourceHeight <= 0) {
		throw new Error("Source dimensions must be greater than zero.");
	}

	if (viewportWidth <= 0 || viewportHeight <= 0) {
		throw new Error("Viewport dimensions must be greater than zero.");
	}

	return {
		width: Math.round(viewportWidth),
		height: Math.round(viewportHeight),
	};
};
