import { useEffect, useState } from "react";
import type { AnimationMode } from "../generator/types/generator";

const ONE_WAY_DURATION = 900;
const ANIMATION_CYCLE_DURATION = 5000;

const clamp = (value: number, minimum: number, maximum: number): number => {
	return Math.min(Math.max(value, minimum), maximum);
};

const easeInOutCubic = (progress: number): number => {
	if (progress < 0.5) {
		return 4 * progress ** 3;
	}

	return 1 - (-2 * progress + 2) ** 3 / 2;
};

const getInitialProgress = (mode: AnimationMode): number => {
	if (mode === "closed") {
		return 1;
	}

	return 0;
};

export const useParametricAnimation = (
	mode: AnimationMode,
	restartKey: unknown,
): number => {
	const [progress, setProgress] = useState(() => getInitialProgress(mode));

	useEffect(() => {
		/*
		 * restartKey 값이 바뀌면 애니메이션을 처음부터 다시 실행한다.
		 * 현재는 업로드한 image 객체가 restartKey로 전달된다.
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

			if (mode === "animate") {
				const cycleProgress =
					(elapsedTime % ANIMATION_CYCLE_DURATION) / ANIMATION_CYCLE_DURATION;

				setProgress(cycleProgress);

				animationFrameId = requestAnimationFrame(animate);

				return;
			}

			const linearProgress = clamp(elapsedTime / ONE_WAY_DURATION, 0, 1);

			const easedProgress = easeInOutCubic(linearProgress);

			if (mode === "open") {
				setProgress(easedProgress);
			} else {
				setProgress(1 - easedProgress);
			}

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
