import JSZip from "jszip";
import { canvasToBlob } from "../../utils/canvasToBlob";
import { renderParametricCanvas } from "../render/renderParametricCanvas";
import type { GeneratorConfig } from "../types/generator";

const DEFAULT_FRAME_RATE = 30;
const DEFAULT_DURATION = 5000;

type CreateAnimationFramesZipOptions = {
	image: HTMLImageElement;
	config: GeneratorConfig;
	frameRate?: number;
	duration?: number;
	onProgress?: (progress: number) => void;
};

export const createAnimationFramesZip = async ({
	image,
	config,
	frameRate = DEFAULT_FRAME_RATE,
	duration = DEFAULT_DURATION,
	onProgress,
}: CreateAnimationFramesZipOptions): Promise<Blob> => {
	const zip = new JSZip();
	const framesFolder = zip.folder("frames");

	if (!framesFolder) {
		throw new Error("ZIP 프레임 폴더를 생성하지 못했습니다.");
	}

	const canvas = document.createElement("canvas");

	const totalFrames = Math.max(Math.round((duration / 1000) * frameRate), 1);

	for (let frameIndex = 0; frameIndex < totalFrames; frameIndex += 1) {
		const animationProgress =
			totalFrames === 1 ? 1 : frameIndex / (totalFrames - 1);

		renderParametricCanvas({
			canvas,
			image,
			config,
			animationProgress,
			isAnimating: true,
		});

		const frameBlob = await canvasToBlob(canvas);

		const frameNumber = String(frameIndex + 1).padStart(4, "0");

		framesFolder.file(`frame-${frameNumber}.png`, frameBlob);

		onProgress?.((frameIndex + 1) / totalFrames);
	}

	return zip.generateAsync({
		type: "blob",
		compression: "DEFLATE",
		compressionOptions: {
			level: 6,
		},
	});
};
