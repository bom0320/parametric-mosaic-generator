import type { SampledCell } from "../types/generator";

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

			cells.push({
				column,
				row,
				color: {
					red: imageData.data[pixelIndex],
					green: imageData.data[pixelIndex + 1],
					blue: imageData.data[pixelIndex + 2],
					alpha: imageData.data[pixelIndex + 3],
				},
			});
		}
	}

	return cells;
};
