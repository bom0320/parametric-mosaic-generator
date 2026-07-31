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

  if (direction === "vertical") {
    const width = Math.max(cellWidth * safeScale - gap, 0);

    return {
      x: cellX + (cellWidth - width) / 2,
      y: cellY,
      width,
      height: cellHeight,
    };
  }

  const height = Math.max(cellHeight * safeScale - gap, 0);

  return {
    x: cellX,
    y: cellY + (cellHeight - height) / 2,
    width: cellWidth,
    height,
  };
};
