import type { RGBColor } from "../types/generator";

export const calculateLuminance = ({ red, green, blue }: RGBColor): number => {
	return Math.round(red * 0.2126 + green * 0.7152 + blue * 0.0722);
};
