import type { Palette } from "../types/generator";

export type PaletteKey = keyof Palette;

export type LuminanceStep = {
	min: number;
	max: number;
	paletteKey: PaletteKey;
	scale: number;
};

export const LUMINANCE_STEPS = [
	// 어두운 영역: col1
	{ min: 0, max: 39, paletteKey: "col1", scale: 1 },
	{ min: 40, max: 79, paletteKey: "col1", scale: 0.85 },

	// 중간 영역: col2
	{ min: 80, max: 119, paletteKey: "col2", scale: 1 },
	{ min: 120, max: 159, paletteKey: "col2", scale: 0.82 },

	// 밝은 영역: col3
	{ min: 160, max: 199, paletteKey: "col3", scale: 0.45 },

	// 가장 밝은 영역: col4
	{ min: 200, max: 255, paletteKey: "col4", scale: 1 },
] satisfies LuminanceStep[];
