import { useEffect, useState } from "react";
import type { AnimationMode } from "../generator/types/generator";

const ANIMATION_DURATION = 900;

const easeInOutCubic = (progress: number): number => {
	if (progress < 0.5) {
		return 4 * progress * progress * progress;
	}

	return 1 - (-2 * progress + 2) ** 3 / 2;
};

const getInitialProgress = (mode: AnimationMode): number => {
	return mode === "open" ? 0 : 1;
};

const getAnimatedProgress = (mode: AnimationMode, progress: number): number => {
	return mode === "open" ? progress : 1 - progress;
};

export const useParametricAnimation = (
	mode: AnimationMode,
	restartKey: unknown,
): number => {
	const [progress, setProgress] = useState(() => getInitialProgress(mode));

	useEffect(() => {
		/*
		 * restartKey 값 자체를 계산에 사용하지는 않지만,
		 * 값이 변경되면 이 Effect를 다시 실행해 애니메이션을 재시작한다.
		 */
		void restartKey;

		let animationFrameId = 0;
		let startTime: number | null = null;

		setProgress(getInitialProgress(mode));

		const animate = (currentTime: number) => {
			if (startTime === null) {
				startTime = currentTime;
			}

			const elapsedTime = currentTime - startTime;
			const linearProgress = Math.min(elapsedTime / ANIMATION_DURATION, 1);
			const easedProgress = easeInOutCubic(linearProgress);

			setProgress(getAnimatedProgress(mode, easedProgress));

			if (linearProgress < 1) {
				animationFrameId = requestAnimationFrame(animate);
			}
		};

		animationFrameId = requestAnimationFrame(animate);

		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	}, [mode, restartKey]);

	return progress;
};
