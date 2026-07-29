import { useState } from "react";
import "./App.css";
import { FileUploader } from "./components/FileUploader/FileUploader";
import { GeneratorCanvas } from "./components/GeneratorCanvas/GeneratorCanvas";
import { SamplingPreview } from "./components/SamplingPreview/SamplingPreview";
import { useImageSource } from "./hooks/useImageSource";

function App() {
	const [sourceFile, setSourceFile] = useState<File | null>(null);
	const { image, error, isLoading } = useImageSource(sourceFile);

	return (
		<main className="app">
			<header className="app-header">
				<p className="eyebrow">Core Experiment 01</p>
				<h1>Parametric Mosaic Generator</h1>
				<p>이미지 소스를 Canvas에 로드하고 렌더링하는 첫 번째 실험입니다.</p>
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
								<dd>{sourceFile.type}</dd>
							</div>
						</dl>
					)}

					{isLoading && <p>이미지를 불러오는 중입니다.</p>}
					{error && <p className="error-message">{error}</p>}
				</aside>

				<section className="preview-panel">
					<div className="preview-header">
						<h2>Preview</h2>
						<span>Canvas 2D</span>
					</div>

					<GeneratorCanvas image={image} />
					<SamplingPreview image={image} />
				</section>
			</section>
		</main>
	);
}

export default App;
