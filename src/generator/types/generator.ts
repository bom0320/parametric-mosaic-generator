export type RGBColor = {
	red: number;
	green: number;
	blue: number;
	alpha: number;
};

export type SampledCell = {
	column: number;
	row: number;
	color: RGBColor;
};
