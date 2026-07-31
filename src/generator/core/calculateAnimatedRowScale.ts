type CalculateAnimatedRowScaleOptions = {
	baseScale: number;
	cycleProgress: number;
	row: number;
	totalRows: number;
};

const clamp = (value: number, minimum: number, maximum: number): number => {
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

const calculateRowProgress = (
	sweepProgress: number,
	row: number,
	totalRows: number,
): number => {
	const lastRowIndex = Math.max(totalRows - 1, 1);
	const rowPosition = row / lastRowIndex;

	/*
	 * 각 행이 순차적으로 시작되도록 지연을 준다.
	 *
	 * rowPosition이 작을수록 위쪽 행이므로 먼저 움직이고,
	 * rowPosition이 클수록 아래쪽 행이므로 나중에 움직인다.
	 */
	const rowStart = rowPosition * 0.75;

	const localProgress = clamp((sweepProgress - rowStart) / 0.25, 0, 1);

	return easeInOutCubic(localProgress);
};

export const calculateAnimatedRowScale = ({
	baseScale,
	cycleProgress,
	row,
	totalRows,
}: CalculateAnimatedRowScaleOptions): number => {
	/*
	 * 전체 5초 사이클:
	 *
	 * 0.00 ~ 0.10
	 * 열린 상태 유지
	 *
	 * 0.10 ~ 0.40
	 * 위에서 아래로 닫힘
	 *
	 * 0.40 ~ 0.60
	 * 닫힌 상태 유지
	 *
	 * 0.60 ~ 0.90
	 * 위에서 아래로 다시 열림
	 *
	 * 0.90 ~ 1.00
	 * 열린 상태 유지
	 */

	if (cycleProgress < 0.1) {
		return baseScale;
	}

	if (cycleProgress < 0.4) {
		const sweepProgress = (cycleProgress - 0.1) / 0.3;

		const rowProgress = calculateRowProgress(sweepProgress, row, totalRows);

		return lerp(baseScale, 0, rowProgress);
	}

	if (cycleProgress < 0.6) {
		return 0;
	}

	if (cycleProgress < 0.9) {
		const sweepProgress = (cycleProgress - 0.6) / 0.3;

		const rowProgress = calculateRowProgress(sweepProgress, row, totalRows);

		return lerp(0, baseScale, rowProgress);
	}

	return baseScale;
};
