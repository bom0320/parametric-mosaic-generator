import { useEffect, useRef, useState } from "react";
import { createAnimationFramesZip } from "../../generator/export/createAnimationFramesZip";
import { renderParametricCanvas } from "../../generator/render/renderParametricCanvas";
import type { GeneratorConfig } from "../../generator/types/generator";
import { isVideoSource, type VisualSource } from "../../generator/types/source";
import { useParametricAnimation } from "../../hooks/useParametricAnimation";
import { canvasToBlob } from "../../utils/canvasToBlob";
import { createExportFileName } from "../../utils/createExportFileName";
import { downloadBlob } from "../../utils/downloadBlob";

type ParametricPreviewProps = {
	source: VisualSource | null;
	config: GeneratorConfig;
	animationRunId: number;
};

export const ParametricPreview = ({
	source,
	config,
	animationRunId,
}: ParametricPreviewProps) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const [isRecording, setIsRecording] = useState(false);
	const [recordingProgress, setRecordingProgress] = useState(0);

	const animationState = useParametricAnimation({
		mode: config.animationMode,
		restartKey: source,
		animationRunId,
	});

	useEffect(() => {
		const canvas = canvasRef.current;

		if (!canvas || !source) {
			return;
		}

		let animationFrameId = 0;

		const renderFrame = () => {
			renderParametricCanvas({
				canvas,
				image: source,
				config,
				animationProgress: animationState.progress,
				isAnimating: animationState.isAnimating,
			});

			if (isVideoSource(source)) {
				animationFrameId = requestAnimationFrame(renderFrame);
			}
		};

		renderFrame();

		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	}, [source, config, animationState.progress, animationState.isAnimating]);

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
		if (!source || isRecording) {
			return;
		}

		setIsRecording(true);
		setRecordingProgress(0);

		try {
			const zipBlob = await createAnimationFramesZip({
				image: source,
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

	if (!source) {
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
