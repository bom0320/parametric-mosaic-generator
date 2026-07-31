import type {
	AnimationMode,
	GeneratorConfig,
} from "../../generator/types/generator";
import type { SourceMode } from "../../generator/types/source";
import { SourceSelector } from "../\bSourceSelector/SourceSelector";
import { FileUploader } from "../FileUploader/FileUploader";
import { GeneratorControls } from "../GeneratorControls/GeneratorControls";

type ControlPanelProps = {
	sourceMode: SourceMode;
	sourceFile: File | null;
	isLoading: boolean;
	error: string | null;
	isWebcamLoading: boolean;
	isWebcamActive: boolean;
	config: GeneratorConfig;
	onSourceModeChange: (sourceMode: SourceMode) => void;
	onStartWebcam: () => void;
	onStopWebcam: () => void;
	onFileChange: (file: File | null) => void;
	onConfigChange: (config: GeneratorConfig) => void;
	onAnimationModeChange: (animationMode: AnimationMode) => void;
};

export const ControlPanel = ({
	sourceMode,
	sourceFile,
	isLoading,
	error,
	isWebcamLoading,
	isWebcamActive,
	config,
	onSourceModeChange,
	onStartWebcam,
	onStopWebcam,
	onFileChange,
	onConfigChange,
	onAnimationModeChange,
}: ControlPanelProps) => {
	return (
		<aside className="control-panel">
			<h2>Source</h2>

			<SourceSelector
				sourceMode={sourceMode}
				isWebcamLoading={isWebcamLoading}
				isWebcamActive={isWebcamActive}
				onSourceModeChange={onSourceModeChange}
				onStartWebcam={onStartWebcam}
				onStopWebcam={onStopWebcam}
			/>

			{sourceMode === "image" && (
				<>
					<FileUploader onFileChange={onFileChange} />

					{sourceFile && (
						<dl className="file-information">
							<div>
								<dt>파일명</dt>
								<dd>{sourceFile.name}</dd>
							</div>

							<div>
								<dt>파일 형식</dt>
								<dd>{sourceFile.type || "알 수 없음"}</dd>
							</div>
						</dl>
					)}
				</>
			)}

			{sourceMode === "webcam" && isWebcamActive && (
				<p className="status-message">웹캠이 연결되었습니다.</p>
			)}

			{isLoading && <p className="status-message">소스를 불러오는 중입니다.</p>}

			{error && <p className="error-message">{error}</p>}

			<GeneratorControls
				config={config}
				onChange={onConfigChange}
				onAnimationModeChange={onAnimationModeChange}
			/>
		</aside>
	);
};
