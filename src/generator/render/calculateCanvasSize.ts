type CanvasSize = {
	width: number;
	height: number;
};

const MAX_CANVAS_WIDTH = 960;
const MAX_CANVAS_HEIGHT = 720;

export const calculateCanvasSize = (image: HTMLImageElement): CanvasSize => {
	const sourceWidth = image.naturalWidth;
	const sourceHeight = image.naturalHeight;

	if (sourceWidth <= 0 || sourceHeight <= 0) {
		throw new Error("Image dimensions must be greater than zero.");
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
