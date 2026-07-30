const MIN_BLUR_RADIUS = 0;
const MAX_BLUR_RADIUS = 7;

const clampBlurRadius = (radius: number): number => {
	return Math.min(
		Math.max(Math.round(radius), MIN_BLUR_RADIUS),
		MAX_BLUR_RADIUS,
	);
};

export const blurImageData = (source: ImageData, radius: number): ImageData => {
	const blurRadius = clampBlurRadius(radius);

	if (blurRadius === 0) {
		return source;
	}

	const { width, height, data } = source;
	const output = new ImageData(width, height);

	for (let row = 0; row < height; row += 1) {
		for (let column = 0; column < width; column += 1) {
			let redTotal = 0;
			let greenTotal = 0;
			let blueTotal = 0;
			let alphaTotal = 0;
			let sampleCount = 0;

			const startRow = Math.max(0, row - blurRadius);
			const endRow = Math.min(height - 1, row + blurRadius);
			const startColumn = Math.max(0, column - blurRadius);
			const endColumn = Math.min(width - 1, column + blurRadius);

			for (let sampleRow = startRow; sampleRow <= endRow; sampleRow += 1) {
				for (
					let sampleColumn = startColumn;
					sampleColumn <= endColumn;
					sampleColumn += 1
				) {
					const sampleIndex = (sampleRow * width + sampleColumn) * 4;

					redTotal += data[sampleIndex] ?? 0;
					greenTotal += data[sampleIndex + 1] ?? 0;
					blueTotal += data[sampleIndex + 2] ?? 0;
					alphaTotal += data[sampleIndex + 3] ?? 255;

					sampleCount += 1;
				}
			}

			const outputIndex = (row * width + column) * 4;

			output.data[outputIndex] = Math.round(redTotal / sampleCount);
			output.data[outputIndex + 1] = Math.round(greenTotal / sampleCount);
			output.data[outputIndex + 2] = Math.round(blueTotal / sampleCount);
			output.data[outputIndex + 3] = Math.round(alphaTotal / sampleCount);
		}
	}

	return output;
};
