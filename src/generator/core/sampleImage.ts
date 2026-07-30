import type {
	ImageAdjustments,
	RGBColor,
	SampledCell,
} from "../types/generator";
import { adjustColor } from "./adjustColor";
import { blurImageData } from "./blurImageData";
import { calculateLuminance } from "./calculateLuminance";

type SampleImageOptions = {
	columns: number;
	rows: number;
	adjustments?: ImageAdjustments;
};

const DEFAULT_ADJUSTMENTS: ImageAdjustments = {
	brightness: 0,
	contrast: 0,
	blur: 0,
};

export const sampleImage = (
	image: HTMLImageElement,
	options: SampleImageOptions,
): SampledCell[] => {
	const { columns, rows, adjustments = DEFAULT_ADJUSTMENTS } = options;

	if (columns <= 0 || rows <= 0) {
		throw new Error("Grid columns and rows must be greater than zero.");
	}

	const canvas = document.createElement("canvas");

	canvas.width = columns;
	canvas.height = rows;

	const context = canvas.getContext("2d", {
		willReadFrequently: true,
	});

	if (!context) {
		throw new Error("Failed to create a sampling canvas context.");
	}

	context.imageSmoothingEnabled = true;
	context.imageSmoothingQuality = "high";

	context.drawImage(image, 0, 0, columns, rows);

	const sourceImageData = context.getImageData(0, 0, columns, rows);

	const imageData = blurImageData(sourceImageData, adjustments.blur);

	const cells: SampledCell[] = [];

	for (let row = 0; row < rows; row += 1) {
		for (let column = 0; column < columns; column += 1) {
			const pixelIndex = (row * columns + column) * 4;

			const sourceColor: RGBColor = {
				red: imageData.data[pixelIndex] ?? 0,
				green: imageData.data[pixelIndex + 1] ?? 0,
				blue: imageData.data[pixelIndex + 2] ?? 0,
				alpha: imageData.data[pixelIndex + 3] ?? 255,
			};

			const color = adjustColor(sourceColor, adjustments);

			const luminance = calculateLuminance(color);

			cells.push({
				column,
				row,
				color,
				luminance,
			});
		}
	}

	return cells;
};
