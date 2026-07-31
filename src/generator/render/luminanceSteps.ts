import type { Palette } from "../types/generator";

export type PaletteKey = keyof Palette;

export type LuminanceStep = {
	min: number;
	max: number;
	paletteKey: PaletteKey;
	scale: number;
};

export const LUMINANCE_STEPS = [
	// 어두운 영역
	{ min: 0, max: 27, paletteKey: "col1", scale: 1 },
	{ min: 28, max: 55, paletteKey: "col1", scale: 1 },
	{ min: 56, max: 84, paletteKey: "col1", scale: 0.85 },

	// 중간 영역
	{ min: 85, max: 112, paletteKey: "col2", scale: 1 },
	{ min: 113, max: 141, paletteKey: "col2", scale: 1 },
	{ min: 142, max: 169, paletteKey: "col2", scale: 0.82 },

	// 밝은 영역
	{ min: 170, max: 198, paletteKey: "col3", scale: 0.5 },
	{ min: 199, max: 226, paletteKey: "col3", scale: 0.3 },

	// 가장 밝은 영역
	{ min: 227, max: 255, paletteKey: "col4", scale: 1 },
] satisfies LuminanceStep[];
