import type { RenderMode } from "../types/generator";

type CalculateShapeBoundsOptions = {
	column: number;
	row: number;
	cellSize: number;
	gap: number;
	luminance: number;
	mode: RenderMode;
};

export type ShapeBounds = {
	x: number;
	y: number;
	width: number;
	height: number;
};

const MAX_LUMINANCE = 255;

export const calculateShapeBounds = ({
	column,
	row,
	cellSize,
	gap,
	luminance,
	mode,
}: CalculateShapeBoundsOptions): ShapeBounds => {
	const availableSize = Math.max(cellSize - gap, 0);
	const normalizedLuminance = luminance / MAX_LUMINANCE;

	const width =
		mode === "width" ? availableSize * normalizedLuminance : availableSize;

	const height =
		mode === "height" ? availableSize * normalizedLuminance : availableSize;

	const cellX = column * cellSize;
	const cellY = row * cellSize;

	return {
		x: cellX + (cellSize - width) / 2,
		y: cellY + (cellSize - height) / 2,
		width,
		height,
	};
};
