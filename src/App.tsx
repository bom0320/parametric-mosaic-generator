import { useState } from "react";

import { ControlPanel } from "./components/ControlPanel/ControlPanel";
import { PreviewPanel } from "./components/PreviewPanel/PreviewPanel";
import { DEFAULT_GENERATOR_CONFIG } from "./generator/config/defaultGeneratorConfig";
import type { GeneratorConfig } from "./generator/types/generator";
import { useImageSource } from "./hooks/useImageSource";

function App() {
	const [sourceFile, setSourceFile] = useState<File | null>(null);
	const [config, setConfig] = useState<GeneratorConfig>(
		DEFAULT_GENERATOR_CONFIG,
	);

	const { image, error, isLoading } = useImageSource(sourceFile);

	return (
		<main className="app">
			<header className="app-header">
				<p className="eyebrow">Core Experiment 01</p>
				<h1>Parametric Mosaic Generator</h1>
				<p>이미지를 분석하고 명암에 따라 도형의 크기를 변환합니다.</p>
			</header>

			<section className="workspace">
				<ControlPanel
					sourceFile={sourceFile}
					isLoading={isLoading}
					error={error}
					config={config}
					onFileChange={setSourceFile}
					onConfigChange={setConfig}
				/>

				<PreviewPanel image={image} config={config} />
			</section>
		</main>
	);
}

export default App;
