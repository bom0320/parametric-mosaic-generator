export type RGBColor = {
	red: number;
	green: number;
	blue: number;
	alpha: number;
};

export type LuminanceSegment = "dark" | "mid" | "light";

export type SampledCell = {
	column: number;
	row: number;
	color: RGBColor;
	luminance: number;
	segment: LuminanceSegment;
};
