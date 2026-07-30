export type RGBColor = {
	red: number;
	green: number;
	blue: number;
	alpha: number;
};

export type LuminanceSegment = "dark" | "mid" | "light";

export type BlindDirection = "horizontal" | "vertical";

export type SegmentStyle = {
	color: string;
};

export type SegmentStyles = Record<LuminanceSegment, SegmentStyle>;

export type GeneratorConfig = {
	tilesX: number;
	tilesY: number;
	cellSize: number;
	gap: number;
	direction: BlindDirection;
	segments: SegmentStyles;
};

export type SampledCell = {
	column: number;
	row: number;
	color: RGBColor;
	luminance: number;
	segment: LuminanceSegment;
};
