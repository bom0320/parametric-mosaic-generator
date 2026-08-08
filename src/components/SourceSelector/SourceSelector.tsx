import type { SourceMode } from "../../generator/types/source";
import { FileUploader } from "../FileUploader/FileUploader";

type SourceSelectorProps = {
	sourceMode: SourceMode;
	isWebcamLoading: boolean;
	isWebcamActive: boolean;
	onSourceModeChange: (sourceMode: SourceMode) => void;
	onStartWebcam: () => void;
	onStopWebcam: () => void;
	onFileChange: (file: File | null) => void;
};

export const SourceSelector = ({
	sourceMode,
	isWebcamLoading,
	isWebcamActive,
	onSourceModeChange,
	onStartWebcam,
	onStopWebcam,
	onFileChange,
}: SourceSelectorProps) => {
	const handleImageChange = (file: File | null) => {
		if (!file) {
			return;
		}

		onStopWebcam();
		onSourceModeChange("image");
		onFileChange(file);
	};

	const handleWebcamClick = () => {
		if (isWebcamActive) {
			onStopWebcam();
			return;
		}

		onSourceModeChange("webcam");
		onStartWebcam();
	};

	return (
		<section className="source-selector">
			<div className="source-action-buttons">
				<FileUploader onFileChange={handleImageChange} />

				<button
					type="button"
					className={
						sourceMode === "webcam" && isWebcamActive ? "is-active" : undefined
					}
					onClick={handleWebcamClick}
					disabled={isWebcamLoading}
				>
					{isWebcamLoading
						? "Starting..."
						: isWebcamActive
							? "Stop Webcam"
							: "Webcam"}
				</button>
			</div>
		</section>
	);
};
