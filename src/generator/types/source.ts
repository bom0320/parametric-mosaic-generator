export type SourceMode = "image" | "webcam";

export type VisualSource = HTMLImageElement | HTMLVideoElement;

export const isVideoSource = (
	source: VisualSource,
): source is HTMLVideoElement => {
	return source instanceof HTMLVideoElement;
};
