import { useCallback, useRef, useState } from "react";

import { ControlPanel } from "./components/ControlPanel/ControlPanel";
import { PreviewPanel } from "./components/PreviewPanel/PreviewPanel";
import { SourcePanel } from "./components/SourcePanel/SourcePanel";
import { DEFAULT_GENERATOR_CONFIG } from "./generator/config/defaultGeneratorConfig";
import { createAnimationFramesZip } from "./generator/export/createAnimationFramesZip";
import type {
	AnimationMode,
	GeneratorConfig,
} from "./generator/types/generator";
import type { SourceMode, VisualSource } from "./generator/types/source";
import { useImageSource } from "./hooks/useImageSource";
import { useWebcamSource } from "./hooks/useWebcamSource";
import { canvasToBlob } from "./utils/canvasToBlob";
import { createExportFileName } from "./utils/createExportFileName";
import { downloadBlob } from "./utils/downloadBlob";

function App() {
	const [sourceFile, setSourceFile] = useState<File | null>(null);
	const [sourceMode, setSourceMode] = useState<SourceMode>("image");
	const [isControlsVisible, setIsControlsVisible] = useState(true);

	const [config, setConfig] = useState<GeneratorConfig>(
		DEFAULT_GENERATOR_CONFIG,
	);

	const [animationRunId, setAnimationRunId] = useState(0);

	const [isExporting, setIsExporting] = useState(false);
	const [exportProgress, setExportProgress] = useState(0);

	const previewCanvasRef = useRef<HTMLCanvasElement>(null);

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

	const handleToggleControls = useCallback(() => {
		setIsControlsVisible((current) => !current);
	}, []);

	const handleSavePng = useCallback(async () => {
		const canvas = previewCanvasRef.current;

		if (!canvas || !source) {
			return;
		}

		try {
			const blob = await canvasToBlob(canvas);

			downloadBlob(blob, createExportFileName("png"));
		} catch (error) {
			console.error("PNG 저장에 실패했습니다.", error);
		}
	}, [source]);

	const handleExportAnimation = useCallback(async () => {
		if (!source || isExporting) {
			return;
		}

		setIsExporting(true);
		setExportProgress(0);

		try {
			const zipBlob = await createAnimationFramesZip({
				image: source,
				config,
				onProgress: setExportProgress,
			});

			downloadBlob(zipBlob, createExportFileName("zip"));
		} catch (error) {
			console.error("애니메이션 프레임 저장에 실패했습니다.", error);
		} finally {
			setIsExporting(false);
			setExportProgress(0);
		}
	}, [source, config, isExporting]);

	return (
		<main className={`app${isControlsVisible ? "" : " controls-hidden"}`}>
			{isControlsVisible && (
				<SourcePanel
					source={source}
					sourceMode={sourceMode}
					sourceFile={sourceFile}
					isLoading={isLoading}
					error={error}
					isWebcamLoading={isWebcamLoading}
					isWebcamActive={isWebcamActive}
					onSourceModeChange={handleSourceModeChange}
					onStartWebcam={startWebcam}
					onStopWebcam={stopWebcam}
					onFileChange={setSourceFile}
				/>
			)}

			<section className="generator-stage">
				<PreviewPanel
					source={source}
					config={config}
					animationRunId={animationRunId}
					canvasRef={previewCanvasRef}
				/>
			</section>

			{isControlsVisible && (
				<ControlPanel
					config={config}
					canExport={source !== null}
					isExporting={isExporting}
					exportProgress={exportProgress}
					onConfigChange={setConfig}
					onAnimationModeChange={handleAnimationModeChange}
					onSavePng={handleSavePng}
					onExportAnimation={handleExportAnimation}
				/>
			)}

			<button
				type="button"
				className="controls-toggle"
				onClick={handleToggleControls}
			>
				{isControlsVisible ? "Hide Controls" : "Show Controls"}
			</button>
		</main>
	);
}

export default App;
