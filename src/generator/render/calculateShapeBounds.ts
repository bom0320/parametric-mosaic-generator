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

	if (direction === "horizontal") {
		/*
		 * Horizontal blinds
		 *
		 * 가로 길이는 셀 전체를 사용한다.
		 * 세로 굵기만 luminance scale에 따라 달라진다.
		 *
		 * 따라서 좌우 타일이 서로 연결되어 긴 가로선처럼 보인다.
		 */
		const availableHeight = Math.max(cellHeight - gap, 0);
		const height = availableHeight * safeScale;

		return {
			x: cellX,
			y: cellY + (cellHeight - height) / 2,
			width: cellWidth,
			height,
		};
	}

	/*
	 * Vertical blinds
	 *
	 * 세로 길이는 셀 전체를 사용한다.
	 * 가로 굵기만 luminance scale에 따라 달라진다.
	 *
	 * 따라서 위아래 타일이 서로 연결되어 긴 세로선처럼 보인다.
	 */
	const availableWidth = Math.max(cellWidth - gap, 0);
	const width = availableWidth * safeScale;

	return {
		x: cellX + (cellWidth - width) / 2,
		y: cellY,
		width,
		height: cellHeight,
	};
};
