import type { LuminanceSegment } from "../types/generator";

const DARK_THRESHOLD = 85;
const LIGHT_THRESHOLD = 170;

export const mapLuminanceToSegment = (luminance: number): LuminanceSegment => {
	if (luminance < DARK_THRESHOLD) {
		return "dark";
	}

	if (luminance < LIGHT_THRESHOLD) {
		return "mid";
	}

	return "light";
};
