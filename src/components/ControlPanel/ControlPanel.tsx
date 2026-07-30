import type { GeneratorConfig } from "../../generator/types/generator";
import { FileUploader } from "../FileUploader/FileUploader";
import { GeneratorControls } from "../GeneratorControls/GeneratorControls";

type ControlPanelProps = {
	sourceFile: File | null;
	isLoading: boolean;
	error: string | null;
	config: GeneratorConfig;
	onFileChange: (file: File | null) => void;
	onConfigChange: (config: GeneratorConfig) => void;
};

export const ControlPanel = ({
	sourceFile,
	isLoading,
	error,
	config,
	onFileChange,
	onConfigChange,
}: ControlPanelProps) => {
	return (
		<aside className="control-panel">
			<h2>Source</h2>

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

			{isLoading && (
				<p className="status-message">이미지를 불러오는 중입니다.</p>
			)}

			{error && <p className="error-message">{error}</p>}

			<GeneratorControls config={config} onChange={onConfigChange} />
		</aside>
	);
};
