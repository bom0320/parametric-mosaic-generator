export const canvasToBlob = (
	canvas: HTMLCanvasElement,
	type = "image/png",
): Promise<Blob> => {
	return new Promise((resolve, reject) => {
		canvas.toBlob((blob) => {
			if (!blob) {
				reject(new Error("Canvas를 이미지로 변환하지 못했습니다."));
				return;
			}

			resolve(blob);
		}, type);
	});
};
