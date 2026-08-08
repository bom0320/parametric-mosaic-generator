import type { RefObject } from "react";

import type { GeneratorConfig } from "../../generator/types/generator";
import type { VisualSource } from "../../generator/types/source";
import { ParametricPreview } from "../ParametricPreview/ParametricPreview";

type PreviewPanelProps = {
	source: VisualSource | null;
	config: GeneratorConfig;
	animationRunId: number;
	canvasRef: RefObject<HTMLCanvasElement | null>;
};

export const PreviewPanel = ({
	source,
	config,
	animationRunId,
	canvasRef,
}: PreviewPanelProps) => {
	if (!source) {
		return (
			<section className="preview-panel">
				<div className="empty-preview">
					<p>소스를 선택하면 결과가 표시됩니다.</p>
				</div>
			</section>
		);
	}

	return (
		<section className="preview-panel">
			<ParametricPreview
				source={source}
				config={config}
				animationRunId={animationRunId}
				canvasRef={canvasRef}
			/>
		</section>
	);
};
