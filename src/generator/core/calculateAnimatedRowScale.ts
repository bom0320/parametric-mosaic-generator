type CalculateAnimatedRowScaleOptions = {
	baseScale: number;
	cycleProgress: number;
	row: number;
	totalRows: number;
};

const TRANSITION_BAND_ROWS = 6;
const MIN_VISIBLE_SCALE = 0.08;

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

export const calculateAnimatedRowScale = ({
	baseScale,
	cycleProgress,
	row,
	totalRows,
}: CalculateAnimatedRowScaleOptions): number => {
	const safeBaseScale = clamp(baseScale);
	const safeProgress = clamp(cycleProgress);

	if (totalRows <= 0) {
		return safeBaseScale;
	}

	const transitionBand = Math.max(1, Math.min(TRANSITION_BAND_ROWS, totalRows));

	const sweepHead = safeProgress * (totalRows - 1 + transitionBand);

	const sweepTail = sweepHead - transitionBand;

	const minimumScale = Math.min(MIN_VISIBLE_SCALE, safeBaseScale);

	/*
	 * 블라인드가 이미 지나간 위쪽 행:
	 * 얇은 선 상태
	 */
	if (row <= sweepTail) {
		return minimumScale;
	}

	/*
	 * 블라인드가 아직 도착하지 않은 아래쪽 행:
	 * 원래 두께 유지
	 */
	if (row >= sweepHead) {
		return safeBaseScale;
	}

	/*
	 * 블라인드 경계 안에 있는 행:
	 * 원래 두께에서 얇은 선으로 변환
	 */
	const transitionProgress = clamp((sweepHead - row) / transitionBand);

	const easedProgress = easeInOutCubic(transitionProgress);

	return lerp(safeBaseScale, minimumScale, easedProgress);
};
