import type { SourceMode, VisualSource } from "../../generator/types/source";
import { GeneratorCanvas } from "../GeneratorCanvas/GeneratorCanvas";
import { SourceSelector } from "../SourceSelector/SourceSelector";

type SourcePanelProps = {
	source: VisualSource | null;
	sourceMode: SourceMode;
	sourceFile: File | null;
	isLoading: boolean;
	error: string | null;
	isWebcamLoading: boolean;
	isWebcamActive: boolean;
	onSourceModeChange: (sourceMode: SourceMode) => void;
	onStartWebcam: () => void;
	onStopWebcam: () => void;
	onFileChange: (file: File | null) => void;
};

export const SourcePanel = ({
	source,
	sourceMode,
	sourceFile,
	isLoading,
	error,
	isWebcamLoading,
	isWebcamActive,
	onSourceModeChange,
	onStartWebcam,
	onStopWebcam,
	onFileChange,
}: SourcePanelProps) => {
	return (
		<aside className="source-panel">
			<header className="panel-header">
				<span>Source</span>
			</header>

			<div className="source-panel-body">
				<div className="source-preview">
					{source ? (
						<GeneratorCanvas source={source} />
					) : (
						<div className="source-preview-placeholder">No Source</div>
					)}
				</div>

				{sourceMode === "image" && sourceFile && (
					<dl className="source-information">
						<div>
							<dt>Name</dt>
							<dd>{sourceFile.name}</dd>
						</div>

						<div>
							<dt>Type</dt>
							<dd>{sourceFile.type || "Unknown"}</dd>
						</div>
					</dl>
				)}

				{isLoading && <p className="status-message">Loading source...</p>}

				{error && <p className="error-message">{error}</p>}

				<section className="source-pipeline">
					<h2>Pipeline</h2>

					<div className="pipeline-list">
						<div>Image Adjustments</div>
						<div>Luminance</div>
						<div>Mosaic Grid</div>
						<div>Blinds</div>
					</div>
				</section>

				<div className="source-actions">
					<SourceSelector
						sourceMode={sourceMode}
						isWebcamLoading={isWebcamLoading}
						isWebcamActive={isWebcamActive}
						onSourceModeChange={onSourceModeChange}
						onStartWebcam={onStartWebcam}
						onStopWebcam={onStopWebcam}
						onFileChange={onFileChange}
					/>
				</div>
			</div>
		</aside>
	);
};
