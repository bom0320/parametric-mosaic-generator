import { useEffect, useState } from "react";

import { isVideoSource, type VisualSource } from "../generator/types/source";

const DEFAULT_BACKGROUND_COLOR = "#f3f3f3";

const SAMPLE_SIZE = 32;
const EDGE_SIZE = 4;

const extractEdgeAverageColor = (source: VisualSource): string => {
	const canvas = document.createElement("canvas");

	canvas.width = SAMPLE_SIZE;
	canvas.height = SAMPLE_SIZE;

	const context = canvas.getContext("2d", {
		willReadFrequently: true,
	});

	if (!context) {
		return DEFAULT_BACKGROUND_COLOR;
	}

	context.drawImage(source, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);

	const imageData = context.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);

	let red = 0;
	let green = 0;
	let blue = 0;
	let totalWeight = 0;

	for (let y = 0; y < SAMPLE_SIZE; y += 1) {
		for (let x = 0; x < SAMPLE_SIZE; x += 1) {
			const isEdge =
				x < EDGE_SIZE ||
				x >= SAMPLE_SIZE - EDGE_SIZE ||
				y < EDGE_SIZE ||
				y >= SAMPLE_SIZE - EDGE_SIZE;

			if (!isEdge) {
				continue;
			}

			const index = (y * SAMPLE_SIZE + x) * 4;

			const alpha = imageData.data[index + 3] / 255;

			if (alpha <= 0.05) {
				continue;
			}

			red += imageData.data[index] * alpha;
			green += imageData.data[index + 1] * alpha;
			blue += imageData.data[index + 2] * alpha;

			totalWeight += alpha;
		}
	}

	if (totalWeight === 0) {
		return DEFAULT_BACKGROUND_COLOR;
	}

	return `rgb(${Math.round(red / totalWeight)} ${Math.round(
		green / totalWeight,
	)} ${Math.round(blue / totalWeight)})`;
};

export const useSourceBackgroundColor = (
	source: VisualSource | null,
): string => {
	const [backgroundColor, setBackgroundColor] = useState(
		DEFAULT_BACKGROUND_COLOR,
	);

	useEffect(() => {
		if (!source) {
			setBackgroundColor(DEFAULT_BACKGROUND_COLOR);
			return;
		}

		const updateBackgroundColor = () => {
			try {
				const nextColor = extractEdgeAverageColor(source);

				setBackgroundColor(nextColor);
			} catch {
				setBackgroundColor(DEFAULT_BACKGROUND_COLOR);
			}
		};

		if (isVideoSource(source)) {
			if (source.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
				updateBackgroundColor();
			}

			source.addEventListener("loadeddata", updateBackgroundColor);

			return () => {
				source.removeEventListener("loadeddata", updateBackgroundColor);
			};
		}

		updateBackgroundColor();
	}, [source]);

	return backgroundColor;
};
