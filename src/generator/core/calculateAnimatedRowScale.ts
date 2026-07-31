type CalculateAnimatedRowScaleOptions = {
	baseScale: number;
	cycleProgress: number;
	row: number;
	totalRows: number;
};

const TRANSITION_BAND_ROWS = 6;
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

const calculateSweepScale = ({
	startScale,
	endScale,
	progress,
	row,
	totalRows,
}: {
	startScale: number;
	endScale: number;
	progress: number;
	row: number;
	totalRows: number;
}): number => {
	const transitionBand = Math.max(1, Math.min(TRANSITION_BAND_ROWS, totalRows));

	const sweepHead = progress * (totalRows - 1 + transitionBand);

	const sweepTail = sweepHead - transitionBand;

	/*
	 * 경계가 이미 지나간 위쪽 행은
	 * 최종 크기로 변환된 상태다.
	 */
	if (row <= sweepTail) {
		return endScale;
	}

	/*
	 * 경계가 아직 도착하지 않은 아래쪽 행은
	 * 시작 크기를 유지한다.
	 */
	if (row >= sweepHead) {
		return startScale;
	}

	/*
	 * 경계에 걸친 행은 시작 크기에서
	 * 최종 크기로 부드럽게 변한다.
	 */
	const transitionProgress = clamp((sweepHead - row) / transitionBand);

	const easedProgress = easeInOutCubic(transitionProgress);

	return lerp(startScale, endScale, easedProgress);
};

export const calculateAnimatedRowScale = ({
	baseScale,
	cycleProgress,
	row,
	totalRows,
}: CalculateAnimatedRowScaleOptions): number => {
	const safeBaseScale = clamp(baseScale);
	const safeCycleProgress = clamp(cycleProgress);

	if (totalRows <= 0) {
		return safeBaseScale;
	}

	const minimumScale = Math.min(MIN_VISIBLE_SCALE, safeBaseScale);

	/*
	 * 0% ~ 40%
	 * 위에서 아래로 원래 두께에서 얇은 선으로 닫힌다.
	 */
	if (safeCycleProgress < CLOSE_END_PROGRESS) {
		const closingProgress = safeCycleProgress / CLOSE_END_PROGRESS;

		return calculateSweepScale({
			startScale: safeBaseScale,
			endScale: minimumScale,
			progress: closingProgress,
			row,
			totalRows,
		});
	}

	/*
	 * 40% ~ 50%
	 * 전체가 얇아진 상태로 잠시 유지된다.
	 */
	if (safeCycleProgress < OPEN_START_PROGRESS) {
		return minimumScale;
	}

	/*
	 * 50% ~ 90%
	 * 위에서 아래로 얇은 선에서 원래 두께로 열린다.
	 */
	if (safeCycleProgress < OPEN_END_PROGRESS) {
		const openingProgress =
			(safeCycleProgress - OPEN_START_PROGRESS) /
			(OPEN_END_PROGRESS - OPEN_START_PROGRESS);

		return calculateSweepScale({
			startScale: minimumScale,
			endScale: safeBaseScale,
			progress: openingProgress,
			row,
			totalRows,
		});
	}

	/*
	 * 90% ~ 100%
	 * 전체가 열린 상태로 잠시 유지된다.
	 */
	return safeBaseScale;
};
