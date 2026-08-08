import { type CSSProperties, useCallback, useState } from "react";

import { ControlPanel } from "./components/ControlPanel/ControlPanel";
import { PreviewPanel } from "./components/PreviewPanel/PreviewPanel";
import { DEFAULT_GENERATOR_CONFIG } from "./generator/config/defaultGeneratorConfig";
import type {
	AnimationMode,
	GeneratorConfig,
} from "./generator/types/generator";
import type { SourceMode, VisualSource } from "./generator/types/source";
import { useImageSource } from "./hooks/useImageSource";
import { useSourceBackgroundColor } from "./hooks/useSourceBackgroundColor";
import { useWebcamSource } from "./hooks/useWebcamSource";

function App() {
	const [sourceFile, setSourceFile] = useState<File | null>(null);
	const [sourceMode, setSourceMode] = useState<SourceMode>("image");
	const [isControlsVisible, setIsControlsVisible] = useState(true);

	const [config, setConfig] = useState<GeneratorConfig>(
		DEFAULT_GENERATOR_CONFIG,
	);

	const [animationRunId, setAnimationRunId] = useState(0);

	const {
		image,
		error: imageError,
		isLoading: isImageLoading,
	} = useImageSource(sourceFile);

	const {
		video,
		error: webcamError,
		isLoading: isWebcamLoading,
		isActive: isWebcamActive,
		startWebcam,
		stopWebcam,
	} = useWebcamSource();

	const source: VisualSource | null = sourceMode === "webcam" ? video : image;

	const backgroundColor = useSourceBackgroundColor(source);

	const appStyle = {
		"--generator-background": backgroundColor,
	} as CSSProperties;

	const error = sourceMode === "webcam" ? webcamError : imageError;

	const isLoading = sourceMode === "webcam" ? isWebcamLoading : isImageLoading;

	const handleAnimationModeChange = useCallback(
		(animationMode: AnimationMode) => {
			setConfig((currentConfig) => ({
				...currentConfig,
				animationMode,
			}));

			setAnimationRunId((currentRunId) => currentRunId + 1);
		},
		[],
	);

	const handleSourceModeChange = useCallback((nextSourceMode: SourceMode) => {
		setSourceMode(nextSourceMode);
	}, []);

	const handleToggleControls = useCallback(() => {
		setIsControlsVisible((current) => !current);
	}, []);

	return (
		<main
			className={`app${isControlsVisible ? " has-controls" : ""}`}
			style={appStyle}
		>
			<section className="generator-stage">
				<PreviewPanel
					source={source}
					config={config}
					animationRunId={animationRunId}
				/>
			</section>

			<div className="controls-overlay">
				<button
					type="button"
					className="controls-toggle"
					onClick={handleToggleControls}
				>
					{isControlsVisible ? "Hide Controls" : "Show Controls"}
				</button>

				{isControlsVisible && (
					<ControlPanel
						sourceMode={sourceMode}
						sourceFile={sourceFile}
						isLoading={isLoading}
						error={error}
						isWebcamLoading={isWebcamLoading}
						isWebcamActive={isWebcamActive}
						config={config}
						onSourceModeChange={handleSourceModeChange}
						onStartWebcam={startWebcam}
						onStopWebcam={stopWebcam}
						onFileChange={setSourceFile}
						onConfigChange={setConfig}
						onAnimationModeChange={handleAnimationModeChange}
					/>
				)}
			</div>
		</main>
	);
}

export default App;
