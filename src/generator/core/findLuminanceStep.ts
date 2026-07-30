import { LUMINANCE_STEPS, type LuminanceStep } from "../render/luminanceSteps";

export const findLuminanceStep = (luminance: number): LuminanceStep => {
	const step = LUMINANCE_STEPS.find(
		(item) => luminance >= item.min && luminance <= item.max,
	);

	if (!step) {
		throw new Error(`No luminance step found for value: ${luminance}`);
	}

	return step;
};
