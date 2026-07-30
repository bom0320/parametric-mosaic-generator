import type { BlindDirection } from "../types/generator";

type CalculateShapeBoundsOptions = {
	column: number;
	row: number;
	cellWidth: number;
	cellHeight: number;
	gap: number;
	scale: number;
	direction: BlindDirection;
};

export type ShapeBounds = {
	x: number;
	y: number;
	width: number;
	height: number;
};

export const calculateShapeBounds = ({
	column,
	row,
	cellWidth,
	cellHeight,
	gap,
	scale,
	direction,
}: CalculateShapeBoundsOptions): ShapeBounds => {
	const availableWidth = Math.max(cellWidth - gap, 0);
	const availableHeight = Math.max(cellHeight - gap, 0);
	const safeScale = Math.min(Math.max(scale, 0), 1);

	const width =
		direction === "vertical" ? availableWidth * safeScale : availableWidth;

	const height =
		direction === "horizontal" ? availableHeight * safeScale : availableHeight;

	const cellX = column * cellWidth;
	const cellY = row * cellHeight;

	return {
		x: cellX + (cellWidth - width) / 2,
		y: cellY + (cellHeight - height) / 2,
		width,
		height,
	};
};
