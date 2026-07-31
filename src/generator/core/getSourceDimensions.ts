import type { VisualSource } from "../types/source";
import { isVideoSource } from "../types/source";

type SourceDimensions = {
	width: number;
	height: number;
};

export const getSourceDimensions = (source: VisualSource): SourceDimensions => {
	if (isVideoSource(source)) {
		return {
			width: source.videoWidth,
			height: source.videoHeight,
		};
	}

	return {
		width: source.naturalWidth,
		height: source.naturalHeight,
	};
};
