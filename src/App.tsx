import { useCallback, useState } from "react";

import { ControlPanel } from "./components/ControlPanel/ControlPanel";
import { PreviewPanel } from "./components/PreviewPanel/PreviewPanel";
import { DEFAULT_GENERATOR_CONFIG } from "./generator/config/defaultGeneratorConfig";
import type {
	AnimationMode,
	GeneratorConfig,
} from "./generator/types/generator";
import { useImageSource } from "./hooks/useImageSource";

function App() {
	const [sourceFile, setSourceFile] = useState<File | null>(null);

	const [config, setConfig] = useState<GeneratorConfig>(
		DEFAULT_GENERATOR_CONFIG,
	);

	const [animationRunId, setAnimationRunId] = useState(0);

	const { image, error, isLoading } = useImageSource(sourceFile);

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

	const handleAnimationComplete = useCallback(() => {
		/*
		 * Animate가 끝난 뒤 실제 설정값을 Open으로 맞춘다.
		 *
		 * animationRunId는 증가시키지 않기 때문에
		 * Open 애니메이션이 추가로 실행되지는 않는다.
		 */
		setConfig((currentConfig) => ({
			...currentConfig,
			animationMode: "open",
		}));
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
					sourceFile={sourceFile}
					isLoading={isLoading}
					error={error}
					config={config}
					onFileChange={setSourceFile}
					onConfigChange={setConfig}
					onAnimationModeChange={handleAnimationModeChange}
				/>

				<PreviewPanel
					image={image}
					config={config}
					animationRunId={animationRunId}
					onAnimationComplete={handleAnimationComplete}
				/>
			</section>
		</main>
	);
}

export default App;
