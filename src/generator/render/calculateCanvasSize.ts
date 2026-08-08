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

const PREVIEW_MARGIN = 20;

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

	const maxWidth = Math.max(viewportWidth - PREVIEW_MARGIN * 2, 1);

	const maxHeight = Math.max(viewportHeight - PREVIEW_MARGIN * 2, 1);

	const scale = Math.min(maxWidth / sourceWidth, maxHeight / sourceHeight);

	return {
		width: Math.max(Math.round(sourceWidth * scale), 1),
		height: Math.max(Math.round(sourceHeight * scale), 1),
	};
};
