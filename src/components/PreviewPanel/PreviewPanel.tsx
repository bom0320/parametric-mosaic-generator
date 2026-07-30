import { useState } from "react";
import type { GeneratorConfig } from "../../generator/types/generator";
import { GeneratorCanvas } from "../GeneratorCanvas/GeneratorCanvas";
import { ParametricPreview } from "../ParametricPreview/ParametricPreview";
import { SamplingPreview } from "../SamplingPreview/SamplingPreview";

type PreviewMode = "original" | "luminance" | "parametric";

type PreviewPanelProps = {
	image: HTMLImageElement | null;
	config: GeneratorConfig;
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
		label: "Luminance",
		value: "luminance",
	},
	{
		label: "Parametric",
		value: "parametric",
	},
];

export const PreviewPanel = ({ image, config }: PreviewPanelProps) => {
	const [previewMode, setPreviewMode] = useState<PreviewMode>("parametric");

	const renderPreview = () => {
		if (!image) {
			return (
				<div className="empty-preview">
					<p>이미지를 선택하면 결과가 표시됩니다.</p>
				</div>
			);
		}

		switch (previewMode) {
			case "original":
				return <GeneratorCanvas image={image} />;

			case "luminance":
				return (
					<SamplingPreview
						image={image}
						columns={config.columns}
						rows={config.rows}
					/>
				);

			case "parametric":
				return <ParametricPreview image={image} config={config} />;
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
