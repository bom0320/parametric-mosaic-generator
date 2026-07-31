import { useEffect, useRef, useState } from "react";
import type { AnimationMode } from "../generator/types/generator";

const ONE_WAY_DURATION = 900;
const ANIMATE_DURATION = 5000;

type ParametricAnimationState = {
	progress: number;
	isAnimating: boolean;
};

type UseParametricAnimationOptions = {
	mode: AnimationMode;
	restartKey: unknown;
	animationRunId: number;
};

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
	return mode === "closed" ? 1 : 0;
};

export const useParametricAnimation = ({
	mode,
	restartKey,
	animationRunId,
}: UseParametricAnimationOptions): ParametricAnimationState => {
	const [animationState, setAnimationState] =
		useState<ParametricAnimationState>({
			progress: getInitialProgress(mode),
			isAnimating: false,
		});

	const modeRef = useRef(mode);

	useEffect(() => {
		modeRef.current = mode;
	}, [mode]);

	useEffect(() => {
		/*
		 * 두 값은 계산에 직접 쓰이지 않지만,
		 * 변경될 때마다 애니메이션을 새로 실행하는 신호다.
		 */
		void restartKey;
		void animationRunId;

		const activeMode = modeRef.current;

		let animationFrameId = 0;
		let startTime: number | null = null;

		setAnimationState({
			progress: getInitialProgress(activeMode),
			isAnimating: activeMode === "animate",
		});

		const animate = (currentTime: number) => {
			if (startTime === null) {
				startTime = currentTime;
			}

			const elapsedTime = currentTime - startTime;

			if (activeMode === "animate") {
				const progress = clamp(elapsedTime / ANIMATE_DURATION, 0, 1);

				setAnimationState({
					progress,
					isAnimating: progress < 1,
				});

				if (progress < 1) {
					animationFrameId = requestAnimationFrame(animate);
				}

				return;
			}

			const linearProgress = clamp(elapsedTime / ONE_WAY_DURATION, 0, 1);

			const easedProgress = easeInOutCubic(linearProgress);

			const progress =
				activeMode === "open" ? easedProgress : 1 - easedProgress;

			setAnimationState({
				progress,
				isAnimating: false,
			});

			if (linearProgress < 1) {
				animationFrameId = requestAnimationFrame(animate);
			}
		};

		animationFrameId = requestAnimationFrame(animate);

		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	}, [restartKey, animationRunId]);

	return animationState;
};
