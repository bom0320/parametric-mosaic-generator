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
	onAnimationComplete: () => void;
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
	onAnimationComplete,
}: UseParametricAnimationOptions): ParametricAnimationState => {
	const [animationState, setAnimationState] =
		useState<ParametricAnimationState>({
			progress: getInitialProgress(mode),
			isAnimating: false,
		});

	const handledAnimationRunIdRef = useRef(animationRunId);
	const onAnimationCompleteRef = useRef(onAnimationComplete);

	useEffect(() => {
		onAnimationCompleteRef.current = onAnimationComplete;
	}, [onAnimationComplete]);

	useEffect(() => {
		void restartKey;

		let animationFrameId = 0;
		let startTime: number | null = null;

		const shouldRunAnimate =
			animationRunId !== handledAnimationRunIdRef.current;

		if (shouldRunAnimate) {
			handledAnimationRunIdRef.current = animationRunId;

			setAnimationState({
				progress: 0,
				isAnimating: true,
			});
		} else {
			setAnimationState({
				progress: getInitialProgress(mode),
				isAnimating: false,
			});
		}

		const animate = (currentTime: number) => {
			if (startTime === null) {
				startTime = currentTime;
			}

			const elapsedTime = currentTime - startTime;

			if (shouldRunAnimate) {
				const progress = clamp(elapsedTime / ANIMATE_DURATION, 0, 1);

				setAnimationState({
					progress,
					isAnimating: progress < 1,
				});

				if (progress < 1) {
					animationFrameId = requestAnimationFrame(animate);
					return;
				}

				onAnimationCompleteRef.current();
				return;
			}

			const linearProgress = clamp(elapsedTime / ONE_WAY_DURATION, 0, 1);

			const easedProgress = easeInOutCubic(linearProgress);

			const progress = mode === "open" ? easedProgress : 1 - easedProgress;

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
	}, [mode, restartKey, animationRunId]);

	return animationState;
};
