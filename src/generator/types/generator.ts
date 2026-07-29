export type RGBColor = {
	red: number;
	green: number;
	blue: number;
	alpha: number;
};

export type LuminanceSegment = "dark" | "mid" | "light";

export type RenderMode = "width" | "height";

export type GeneratorConfig = {
	columns: number;
	rows: number;
	cellSize: number;
	gap: number;
	mode: RenderMode;
};

export type SampledCell = {
	column: number;
	row: number;
	color: RGBColor;
	luminance: number;
	segment: LuminanceSegment;
};
