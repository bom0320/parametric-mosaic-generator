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

const MIN_VISIBLE_SIZE = 1;

const clampScale = (scale: number): number => {
	return Math.min(Math.max(scale, 0), 1);
};

const calculateScaledSize = (
	cellSize: number,
	gap: number,
	scale: number,
): number => {
	if (scale <= 0) {
		return 0;
	}

	const availableSize = Math.max(cellSize - gap, 0);

	return Math.min(
		Math.max(availableSize * scale, MIN_VISIBLE_SIZE),
		availableSize,
	);
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
	const safeScale = clampScale(scale);

	const cellX = column * cellWidth;
	const cellY = row * cellHeight;

	if (direction === "horizontal") {
		const height = calculateScaledSize(cellHeight, gap, safeScale);

		return {
			x: cellX,
			y: cellY + (cellHeight - height) / 2,
			width: cellWidth,
			height,
		};
	}

	const width = calculateScaledSize(cellWidth, gap, safeScale);

	return {
		x: cellX + (cellWidth - width) / 2,
		y: cellY,
		width,
		height: cellHeight,
	};
};
