type CalculateAnimatedSweepScaleOptions = {
	baseScale: number;
	cycleProgress: number;
	itemIndex: number;
	totalItems: number;
};

const TRANSITION_BAND_SIZE = 6;
const MIN_VISIBLE_SCALE = 0.08;

const CLOSE_END_PROGRESS = 0.4;
const OPEN_START_PROGRESS = 0.5;
const OPEN_END_PROGRESS = 0.9;

const clamp = (value: number, minimum = 0, maximum = 1): number => {
	return Math.min(Math.max(value, minimum), maximum);
};

const lerp = (start: number, end: number, progress: number): number => {
	return start + (end - start) * progress;
};

const easeInOutCubic = (progress: number): number => {
	if (progress < 0.5) {
		return 4 * progress ** 3;
	}

	return 1 - (-2 * progress + 2) ** 3 / 2;
};

type CalculateSweepScaleOptions = {
	startScale: number;
	endScale: number;
	progress: number;
	itemIndex: number;
	totalItems: number;
};

const calculateSweepScale = ({
	startScale,
	endScale,
	progress,
	itemIndex,
	totalItems,
}: CalculateSweepScaleOptions): number => {
	const transitionBand = Math.max(
		1,
		Math.min(TRANSITION_BAND_SIZE, totalItems),
	);

	const sweepHead = progress * (totalItems - 1 + transitionBand);

	const sweepTail = sweepHead - transitionBand;

	// 애니메이션 경계가 이미 지나간 셀
	if (itemIndex <= sweepTail) {
		return endScale;
	}

	// 애니메이션 경계가 아직 도착하지 않은 셀
	if (itemIndex >= sweepHead) {
		return startScale;
	}

	// 경계에 걸쳐 있는 셀
	const transitionProgress = clamp((sweepHead - itemIndex) / transitionBand);

	const easedProgress = easeInOutCubic(transitionProgress);

	return lerp(startScale, endScale, easedProgress);
};

export const calculateAnimatedSweepScale = ({
	baseScale,
	cycleProgress,
	itemIndex,
	totalItems,
}: CalculateAnimatedSweepScaleOptions): number => {
	const safeBaseScale = clamp(baseScale);
	const safeCycleProgress = clamp(cycleProgress);

	if (totalItems <= 0) {
		return safeBaseScale;
	}

	const minimumScale = Math.min(MIN_VISIBLE_SCALE, safeBaseScale);

	/*
	 * 0% ~ 40%
	 * 시작 방향에서 반대 방향으로 닫힌다.
	 *
	 * Horizontal: 위 → 아래
	 * Vertical: 왼쪽 → 오른쪽
	 */
	if (safeCycleProgress < CLOSE_END_PROGRESS) {
		const closingProgress = safeCycleProgress / CLOSE_END_PROGRESS;

		return calculateSweepScale({
			startScale: safeBaseScale,
			endScale: minimumScale,
			progress: closingProgress,
			itemIndex,
			totalItems,
		});
	}

	/*
	 * 40% ~ 50%
	 * 전체가 닫힌 상태로 유지된다.
	 */
	if (safeCycleProgress < OPEN_START_PROGRESS) {
		return minimumScale;
	}

	/*
	 * 50% ~ 90%
	 * 시작 방향에서 반대 방향으로 다시 열린다.
	 */
	if (safeCycleProgress < OPEN_END_PROGRESS) {
		const openingProgress =
			(safeCycleProgress - OPEN_START_PROGRESS) /
			(OPEN_END_PROGRESS - OPEN_START_PROGRESS);

		return calculateSweepScale({
			startScale: minimumScale,
			endScale: safeBaseScale,
			progress: openingProgress,
			itemIndex,
			totalItems,
		});
	}

	/*
	 * 90% ~ 100%
	 * 전체가 열린 상태로 유지된다.
	 */
	return safeBaseScale;
};
