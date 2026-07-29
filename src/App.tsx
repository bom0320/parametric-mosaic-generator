import { useState } from "react";
import "./App.css";
import { FileUploader } from "./components/FileUploader/FileUploader";
import { GeneratorCanvas } from "./components/GeneratorCanvas/GeneratorCanvas";
import { GeneratorControls } from "./components/GeneratorControls/GeneratorControls";
import { ParametricPreview } from "./components/ParametricPreview/ParametricPreview";
import { SamplingPreview } from "./components/SamplingPreview/SamplingPreview";
import type { GeneratorConfig } from "./generator/types/generator";
import { useImageSource } from "./hooks/useImageSource";

type PreviewMode = "original" | "luminance" | "parametric";

const DEFAULT_CONFIG: GeneratorConfig = {
	columns: 60,
	rows: 40,
	cellSize: 12,
	gap: 2,
	mode: "width",
};

function App() {
	const [sourceFile, setSourceFile] = useState<File | null>(null);
	const [config, setConfig] = useState<GeneratorConfig>(DEFAULT_CONFIG);
	const [previewMode, setPreviewMode] = useState<PreviewMode>("parametric");

	const { image, error, isLoading } = useImageSource(sourceFile);

	const renderPreview = () => {
		if (!image) {
			return (
				<div className="empty-preview">
					<p>이미지를 선택하면 결과가 표시됩니다.</p>
				</div>
			);
		}

		if (previewMode === "original") {
			return <GeneratorCanvas image={image} />;
		}

		if (previewMode === "luminance") {
			return (
				<SamplingPreview
					image={image}
					columns={config.columns}
					rows={config.rows}
				/>
			);
		}

		return <ParametricPreview image={image} config={config} />;
	};

	return (
		<main className="app">
			<header className="app-header">
				<p className="eyebrow">Core Experiment 01</p>
				<h1>Parametric Mosaic Generator</h1>
				<p>이미지를 분석하고 명암에 따라 도형의 크기를 변환합니다.</p>
			</header>

			<section className="workspace">
				<aside className="control-panel">
					<h2>Source</h2>

					<FileUploader onFileChange={setSourceFile} />

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

					<GeneratorControls config={config} onChange={setConfig} />
				</aside>

				<section className="preview-panel">
					<div className="preview-header">
						<div>
							<h2>Preview</h2>
							<span>Canvas 2D</span>
						</div>

						<div
							className="preview-tabs"
							role="tablist"
							aria-label="Preview mode"
						>
							<button
								type="button"
								role="tab"
								aria-selected={previewMode === "original"}
								className={
									previewMode === "original"
										? "preview-tab is-active"
										: "preview-tab"
								}
								onClick={() => setPreviewMode("original")}
							>
								Original
							</button>

							<button
								type="button"
								role="tab"
								aria-selected={previewMode === "luminance"}
								className={
									previewMode === "luminance"
										? "preview-tab is-active"
										: "preview-tab"
								}
								onClick={() => setPreviewMode("luminance")}
							>
								Luminance
							</button>

							<button
								type="button"
								role="tab"
								aria-selected={previewMode === "parametric"}
								className={
									previewMode === "parametric"
										? "preview-tab is-active"
										: "preview-tab"
								}
								onClick={() => setPreviewMode("parametric")}
							>
								Parametric
							</button>
						</div>
					</div>

					<div className="preview-content">{renderPreview()}</div>
				</section>
			</section>
		</main>
	);
}

export default App;
