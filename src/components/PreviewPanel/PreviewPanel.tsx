import { useState } from "react";
import type { GeneratorConfig } from "../../generator/types/generator";
import type { VisualSource } from "../../generator/types/source";
import { GeneratorCanvas } from "../GeneratorCanvas/GeneratorCanvas";
import { ParametricPreview } from "../ParametricPreview/ParametricPreview";

type PreviewMode = "original" | "parametric";

type PreviewPanelProps = {
	source: VisualSource | null;
	config: GeneratorConfig;
	animationRunId: number;
};

const PREVIEW_MODES: Array<{
	label: string;
	value: PreviewMode;
}> = [
	{
		label: "Original",
		value: "original",
	},
	{
		label: "Parametric",
		value: "parametric",
	},
];

export const PreviewPanel = ({
	source,
	config,
	animationRunId,
}: PreviewPanelProps) => {
	const [previewMode, setPreviewMode] = useState<PreviewMode>("parametric");

	const renderPreview = () => {
		if (!source) {
			return (
				<div className="empty-preview">
					<p>소스를 선택하면 결과가 표시됩니다.</p>
				</div>
			);
		}

		switch (previewMode) {
			case "original":
				return <GeneratorCanvas source={source} />;

			case "parametric":
				return (
					<ParametricPreview
						source={source}
						config={config}
						animationRunId={animationRunId}
					/>
				);
		}
	};

	return (
		<section className="preview-panel">
			<header className="preview-header">
				<div>
					<h2>Preview</h2>
					<span>Canvas 2D</span>
				</div>

				<div className="preview-tabs" role="tablist" aria-label="Preview mode">
					{PREVIEW_MODES.map((mode) => {
						const isActive = previewMode === mode.value;

						return (
							<button
								key={mode.value}
								type="button"
								role="tab"
								aria-selected={isActive}
								className={isActive ? "preview-tab is-active" : "preview-tab"}
								onClick={() => setPreviewMode(mode.value)}
							>
								{mode.label}
							</button>
						);
					})}
				</div>
			</header>

			<div className="preview-content">{renderPreview()}</div>
		</section>
	);
};
