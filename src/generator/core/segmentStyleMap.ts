import type { LuminanceSegment } from "../types/generator";

export type SegmentStyle = {
	color: string;
	scale: number;
};

export const segmentStyleMap: Record<LuminanceSegment, SegmentStyle> = {
	dark: {
		color: "#202020",
		scale: 0.25,
	},
	mid: {
		color: "#e05d35",
		scale: 0.6,
	},
	light: {
		color: "#f3cc4f",
		scale: 1,
	},
};
