import type { GeneratorConfig } from "../types/generator";

export const DEFAULT_GENERATOR_CONFIG: GeneratorConfig = {
	tilesX: 60,
	tilesY: 40,
	gap: 2,
	direction: "horizontal",
	imageAdjustments: {
		brightness: 0,
		contrast: 0,
		blur: 0,
	},
	palette: {
		col1: "#2557a5",
		col2: "#00c864",
		col3: "#ff6400",
		col4: "#ffffff",
	},
};
