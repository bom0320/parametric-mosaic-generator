import type { ImageAdjustments, RGBColor } from "../types/generator";

const MIN_CHANNEL_VALUE = 0;
const MAX_CHANNEL_VALUE = 255;
const CHANNEL_MIDPOINT = 128;

const clampChannel = (value: number): number => {
	return Math.round(
		Math.min(Math.max(value, MIN_CHANNEL_VALUE), MAX_CHANNEL_VALUE),
	);
};

const adjustChannel = (
	channel: number,
	brightness: number,
	contrast: number,
): number => {
	const brightnessOffset = (brightness / 100) * MAX_CHANNEL_VALUE;

	const contrastFactor = 1 + contrast / 100;

	const contrastedValue =
		(channel - CHANNEL_MIDPOINT) * contrastFactor + CHANNEL_MIDPOINT;

	return clampChannel(contrastedValue + brightnessOffset);
};

export const adjustColor = (
	color: RGBColor,
	adjustments: ImageAdjustments,
): RGBColor => {
	const { brightness, contrast } = adjustments;

	return {
		red: adjustChannel(color.red, brightness, contrast),
		green: adjustChannel(color.green, brightness, contrast),
		blue: adjustChannel(color.blue, brightness, contrast),
		alpha: color.alpha,
	};
};
