import { useCallback, useEffect, useRef, useState } from "react";

type UseWebcamSourceReturn = {
	video: HTMLVideoElement | null;
	error: string | null;
	isLoading: boolean;
	isActive: boolean;
	startWebcam: () => Promise<void>;
	stopWebcam: () => void;
};

export const useWebcamSource = (): UseWebcamSourceReturn => {
	const [video, setVideo] = useState<HTMLVideoElement | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const streamRef = useRef<MediaStream | null>(null);
	const videoRef = useRef<HTMLVideoElement | null>(null);

	const stopWebcam = useCallback(() => {
		streamRef.current?.getTracks().forEach((track) => {
			track.stop();
		});

		streamRef.current = null;

		if (videoRef.current) {
			videoRef.current.pause();
			videoRef.current.srcObject = null;
		}

		videoRef.current = null;

		setVideo(null);
		setIsLoading(false);
	}, []);

	const startWebcam = useCallback(async () => {
		if (!navigator.mediaDevices?.getUserMedia) {
			setError("이 브라우저에서는 웹캠을 사용할 수 없습니다.");
			return;
		}

		stopWebcam();

		setIsLoading(true);
		setError(null);

		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: "user",
					width: {
						ideal: 1280,
					},
					height: {
						ideal: 720,
					},
				},
				audio: false,
			});

			const nextVideo = document.createElement("video");

			nextVideo.autoplay = true;
			nextVideo.muted = true;
			nextVideo.playsInline = true;
			nextVideo.srcObject = stream;

			await new Promise<void>((resolve, reject) => {
				nextVideo.onloadedmetadata = () => {
					resolve();
				};

				nextVideo.onerror = () => {
					reject(new Error("웹캠 영상을 불러오지 못했습니다."));
				};
			});

			await nextVideo.play();

			streamRef.current = stream;
			videoRef.current = nextVideo;

			setVideo(nextVideo);
		} catch (webcamError) {
			stopWebcam();

			if (
				webcamError instanceof DOMException &&
				webcamError.name === "NotAllowedError"
			) {
				setError("카메라 사용 권한이 거부되었습니다.");
				return;
			}

			if (
				webcamError instanceof DOMException &&
				webcamError.name === "NotFoundError"
			) {
				setError("사용 가능한 카메라를 찾지 못했습니다.");
				return;
			}

			setError("웹캠을 시작하지 못했습니다.");
		} finally {
			setIsLoading(false);
		}
	}, [stopWebcam]);

	useEffect(() => {
		return () => {
			streamRef.current?.getTracks().forEach((track) => {
				track.stop();
			});
		};
	}, []);

	return {
		video,
		error,
		isLoading,
		isActive: video !== null,
		startWebcam,
		stopWebcam,
	};
};
