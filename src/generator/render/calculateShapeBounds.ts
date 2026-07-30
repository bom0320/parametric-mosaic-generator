import type { BlindDirection } from "../types/generator";

type CalculateShapeBoundsOptions = {
	column: number;
	row: number;
	cellWidth: number;
	cellHeight: number;
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
	cellWidth,
	cellHeight,
	gap,
	luminance,
	direction,
}: CalculateShapeBoundsOptions): ShapeBounds => {
	const availableWidth = Math.max(cellWidth - gap, 0);
	const availableHeight = Math.max(cellHeight - gap, 0);
	const normalizedLuminance = luminance / MAX_LUMINANCE;

	const width =
		direction === "vertical"
			? availableWidth * normalizedLuminance
			: availableWidth;

	const height =
		direction === "horizontal"
			? availableHeight * normalizedLuminance
			: availableHeight;

	const cellX = column * cellWidth;
	const cellY = row * cellHeight;

	return {
		x: cellX + (cellWidth - width) / 2,
		y: cellY + (cellHeight - height) / 2,
		width,
		height,
	};
};
