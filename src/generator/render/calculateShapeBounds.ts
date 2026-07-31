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

	// gap을 scale 뒤에 빼지 말고, 먼저 "안쪽 셀 영역"을 만든다
	const innerX = cellX + gap / 2;
	const innerY = cellY + gap / 2;
	const innerWidth = Math.max(cellWidth - gap, 0);
	const innerHeight = Math.max(cellHeight - gap, 0);

	if (direction === "vertical") {
		const width =
			safeScale === 0
				? 0
				: Math.min(
						Math.max(innerWidth * safeScale, MIN_VISIBLE_SIZE),
						innerWidth,
					);

		return {
			x: innerX + (innerWidth - width) / 2,
			y: innerY,
			width,
			height: innerHeight,
		};
	}

	const height =
		safeScale === 0
			? 0
			: Math.min(
					Math.max(innerHeight * safeScale, MIN_VISIBLE_SIZE),
					innerHeight,
				);

	return {
		x: innerX,
		y: innerY + (innerHeight - height) / 2,
		width: innerWidth,
		height,
	};
};
