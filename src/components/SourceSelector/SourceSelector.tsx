import type { SourceMode } from "../../generator/types/source";

type SourceSelectorProps = {
	sourceMode: SourceMode;
	isWebcamLoading: boolean;
	isWebcamActive: boolean;
	onSourceModeChange: (sourceMode: SourceMode) => void;
	onStartWebcam: () => void;
	onStopWebcam: () => void;
};

export const SourceSelector = ({
	sourceMode,
	isWebcamLoading,
	isWebcamActive,
	onSourceModeChange,
	onStartWebcam,
	onStopWebcam,
}: SourceSelectorProps) => {
	const handleImageModeClick = () => {
		onStopWebcam();
		onSourceModeChange("image");
	};

	const handleWebcamModeClick = () => {
		onSourceModeChange("webcam");

		if (!isWebcamActive) {
			onStartWebcam();
		}
	};

	return (
		<section className="source-selector">
			<div className="source-mode-buttons">
				<button
					type="button"
					className={sourceMode === "image" ? "is-active" : undefined}
					onClick={handleImageModeClick}
				>
					Image
				</button>

				<button
					type="button"
					className={sourceMode === "webcam" ? "is-active" : undefined}
					onClick={handleWebcamModeClick}
					disabled={isWebcamLoading}
				>
					{isWebcamLoading ? "Starting..." : "Webcam"}
				</button>
			</div>

			{sourceMode === "webcam" && isWebcamActive && (
				<button
					type="button"
					className="stop-webcam-button"
					onClick={onStopWebcam}
				>
					Stop Webcam
				</button>
			)}
		</section>
	);
};
