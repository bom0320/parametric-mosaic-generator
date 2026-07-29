import { useEffect, useState } from "react";

type UseImageSourceReturn = {
	image: HTMLImageElement | null;
	error: string | null;
	isLoading: boolean;
};

export const useImageSource = (file: File | null): UseImageSourceReturn => {
	const [image, setImage] = useState<HTMLImageElement | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!file) {
			setImage(null);
			setError(null);
			setIsLoading(false);
			return;
		}

		if (!file.type.startsWith("image/")) {
			setImage(null);
			setError("이미지 파일만 업로드할 수 있습니다.");
			setIsLoading(false);
			return;
		}

		const objectUrl = URL.createObjectURL(file);
		const nextImage = new Image();

		setIsLoading(true);
		setError(null);

		nextImage.onload = () => {
			setImage(nextImage);
			setIsLoading(false);
		};

		nextImage.onerror = () => {
			setImage(null);
			setError("이미지를 불러오지 못했습니다.");
			setIsLoading(false);
		};

		nextImage.src = objectUrl;

		return () => {
			URL.revokeObjectURL(objectUrl);
		};
	}, [file]);

	return {
		image,
		error,
		isLoading,
	};
};
