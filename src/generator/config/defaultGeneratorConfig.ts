import type { GeneratorConfig } from "../types/generator";

export const DEFAULT_GENERATOR_CONFIG: GeneratorConfig = {
	tilesX: 60,
	tilesY: 40,
	cellSize: 12,
	gap: 2,
	direction: "vertical",
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
