import type { BlindDirection } from "../types/generator";

type CalculateShapeBoundsOptions = {
	column: number;
	row: number;
	cellSize: number;
	gap: number;
	luminance: number;
	direction: BlindDirection;
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
	direction,
}: CalculateShapeBoundsOptions): ShapeBounds => {
	const availableSize = Math.max(cellSize - gap, 0);
	const normalizedLuminance = luminance / MAX_LUMINANCE;

	const width =
		direction === "vertical"
			? availableSize * normalizedLuminance
			: availableSize;

	const height =
		direction === "horizontal"
			? availableSize * normalizedLuminance
			: availableSize;

	const cellX = column * cellSize;
	const cellY = row * cellSize;

	return {
		x: cellX + (cellSize - width) / 2,
		y: cellY + (cellSize - height) / 2,
		width,
		height,
	};
};
