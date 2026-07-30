import type { GeneratorConfig } from "../types/generator";

export const DEFAULT_GENERATOR_CONFIG: GeneratorConfig = {
	tilesX: 60,
	tilesY: 40,
	cellSize: 12,
	gap: 2,
	direction: "horizontal",
	imageAdjustments: {
		brightness: 0,
		contrast: 0,
	},
	segments: {
		dark: {
			color: "#202020",
		},
		mid: {
			color: "#e05d35",
		},
		light: {
			color: "#f3cc4f",
		},
	},
};
