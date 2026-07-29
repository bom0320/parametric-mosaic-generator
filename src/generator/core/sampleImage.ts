import type { RGBColor, SampledCell } from "../types/generator";
import { calculateLuminance } from "./calculateLuminance";
import { mapLuminanceToSegment } from "./mapLuminanceToSegment";

type SampleImageOptions = {
	columns: number;
	rows: number;
};

export const sampleImage = (
	image: HTMLImageElement,
	options: SampleImageOptions,
): SampledCell[] => {
	const { columns, rows } = options;

	if (columns <= 0 || rows <= 0) {
		throw new Error("Grid columns and rows must be greater than zero.");
	}

	const canvas = document.createElement("canvas");
	const context = canvas.getContext("2d", {
		willReadFrequently: true,
	});

	if (!context) {
		throw new Error("Failed to create a 2D canvas context.");
	}

	canvas.width = columns;
	canvas.height = rows;

	context.drawImage(image, 0, 0, columns, rows);

	const imageData = context.getImageData(0, 0, columns, rows);
	const cells: SampledCell[] = [];

	for (let row = 0; row < rows; row += 1) {
		for (let column = 0; column < columns; column += 1) {
			const pixelIndex = (row * columns + column) * 4;

			const color: RGBColor = {
				red: imageData.data[pixelIndex] ?? 0,
				green: imageData.data[pixelIndex + 1] ?? 0,
				blue: imageData.data[pixelIndex + 2] ?? 0,
				alpha: imageData.data[pixelIndex + 3] ?? 255,
			};

			const luminance = calculateLuminance(color);
			const segment = mapLuminanceToSegment(luminance);

			cells.push({
				column,
				row,
				color,
				luminance,
				segment,
			});
		}
	}

	return cells;
};
