export type RGBColor = {
	red: number;
	green: number;
	blue: number;
	alpha: number;
};

export type BlindDirection = "horizontal" | "vertical";

export type ImageAdjustments = {
	brightness: number;
	contrast: number;
};

export type Palette = {
	col1: string;
	col2: string;
	col3: string;
	col4: string;
};

export type GeneratorConfig = {
	tilesX: number;
	tilesY: number;
	gap: number;
	direction: BlindDirection;
	imageAdjustments: ImageAdjustments;
	palette: Palette;
};

export type SampledCell = {
	column: number;
	row: number;
	color: RGBColor;
	luminance: number;
};
