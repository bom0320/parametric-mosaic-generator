import { useCallback, useState } from "react";

import { ControlPanel } from "./components/ControlPanel/ControlPanel";
import { PreviewPanel } from "./components/PreviewPanel/PreviewPanel";
import { DEFAULT_GENERATOR_CONFIG } from "./generator/config/defaultGeneratorConfig";
import type {
	AnimationMode,
	GeneratorConfig,
} from "./generator/types/generator";
import type { SourceMode, VisualSource } from "./generator/types/source";
import { useImageSource } from "./hooks/useImageSource";
import { useWebcamSource } from "./hooks/useWebcamSource";

function App() {
	const [sourceFile, setSourceFile] = useState<File | null>(null);
	const [sourceMode, setSourceMode] = useState<SourceMode>("image");

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

	return (
		<main className="app">
			<header className="app-header">
				<p className="eyebrow">Core Experiment 01</p>

				<h1>Parametric Mosaic Generator</h1>

				<p>이미지를 분석하고 명암에 따라 도형의 크기를 변환합니다.</p>
			</header>

			<section className="workspace">
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

				<PreviewPanel
					source={source}
					config={config}
					animationRunId={animationRunId}
				/>
			</section>
		</main>
	);
}

export default App;
