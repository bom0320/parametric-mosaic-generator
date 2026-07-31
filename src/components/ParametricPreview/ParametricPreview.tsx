import { useEffect, useRef, useState } from "react";
import { createAnimationFramesZip } from "../../generator/export/createAnimationFramesZip";
import { renderParametricCanvas } from "../../generator/render/renderParametricCanvas";
import type { GeneratorConfig } from "../../generator/types/generator";
import { useParametricAnimation } from "../../hooks/useParametricAnimation";
import { canvasToBlob } from "../../utils/canvasToBlob";
import { createExportFileName } from "../../utils/createExportFileName";
import { downloadBlob } from "../../utils/downloadBlob";

type ParametricPreviewProps = {
	image: HTMLImageElement | null;
	config: GeneratorConfig;
	animationRunId: number;
};

export const ParametricPreview = ({
	image,
	config,
	animationRunId,
}: ParametricPreviewProps) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const [isRecording, setIsRecording] = useState(false);
	const [recordingProgress, setRecordingProgress] = useState(0);

	const animationState = useParametricAnimation({
		mode: config.animationMode,
		restartKey: image,
		animationRunId,
	});

	useEffect(() => {
		const canvas = canvasRef.current;

		if (!canvas || !image) {
			return;
		}

		renderParametricCanvas({
			canvas,
			image,
			config,
			animationProgress: animationState.progress,
			isAnimating: animationState.isAnimating,
		});
	}, [image, config, animationState]);

	const handleSavePng = async () => {
		const canvas = canvasRef.current;

		if (!canvas) {
			return;
		}

		try {
			const blob = await canvasToBlob(canvas);

			downloadBlob(blob, createExportFileName("png"));
		} catch (error) {
			console.error("PNG 저장에 실패했습니다.", error);
		}
	};

	const handleStartRecording = async () => {
		if (!image || isRecording) {
			return;
		}

		setIsRecording(true);
		setRecordingProgress(0);

		try {
			const zipBlob = await createAnimationFramesZip({
				image,
				config,
				onProgress: setRecordingProgress,
			});

			downloadBlob(zipBlob, createExportFileName("zip"));
		} catch (error) {
			console.error("애니메이션 프레임 저장에 실패했습니다.", error);
		} finally {
			setIsRecording(false);
			setRecordingProgress(0);
		}
	};

	if (!image) {
		return null;
	}

	const directionLabel =
		config.direction === "horizontal" ? "Horizontal" : "Vertical";

	const recordingPercentage = Math.round(recordingProgress * 100);

	return (
		<section className="parametric-preview">
			<div className="parametric-preview-header">
				<div className="parametric-preview-information">
					<h2>Parametric Preview</h2>

					<span>
						{directionLabel} blinds · {config.tilesX} × {config.tilesY}
					</span>
				</div>

				<div className="export-actions">
					<button
						type="button"
						onClick={handleSavePng}
						disabled={animationState.isAnimating || isRecording}
					>
						Save PNG
					</button>

					<button
						type="button"
						onClick={handleStartRecording}
						disabled={animationState.isAnimating || isRecording}
					>
						{isRecording
							? `Recording ${recordingPercentage}%`
							: "Start Recording (ZIP)"}
					</button>
				</div>
			</div>

			<div className="parametric-canvas-container">
				<canvas ref={canvasRef} className="parametric-canvas" />
			</div>
		</section>
	);
};
