import { useEffect, useRef } from "react";

type GeneratorCanvasProps = {
	image: HTMLImageElement | null;
};

const MAX_CANVAS_WIDTH = 960;
const MAX_CANVAS_HEIGHT = 640;

const calculateCanvasSize = (imageWidth: number, imageHeight: number) => {
	const scale = Math.min(
		MAX_CANVAS_WIDTH / imageWidth,
		MAX_CANVAS_HEIGHT / imageHeight,
		1,
	);

	return {
		width: Math.round(imageWidth * scale),
		height: Math.round(imageHeight * scale),
	};
};

export const GeneratorCanvas = ({ image }: GeneratorCanvasProps) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;

		if (!canvas) {
			return;
		}

		const context = canvas.getContext("2d");

		if (!context) {
			return;
		}

		context.clearRect(0, 0, canvas.width, canvas.height);

		if (!image) {
			return;
		}

		const { width, height } = calculateCanvasSize(
			image.naturalWidth,
			image.naturalHeight,
		);

		canvas.width = width;
		canvas.height = height;

		context.drawImage(image, 0, 0, width, height);
	}, [image]);

	return (
		<div className="canvas-container">
			{!image && (
				<p className="canvas-placeholder">
					이미지를 선택하면 여기에 표시됩니다.
				</p>
			)}

			<canvas
				ref={canvasRef}
				className={image ? "generator-canvas" : "generator-canvas is-empty"}
			/>
		</div>
	);
};
