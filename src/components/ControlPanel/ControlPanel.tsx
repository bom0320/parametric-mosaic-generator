import type {
	AnimationMode,
	GeneratorConfig,
} from "../../generator/types/generator";
import { GeneratorControls } from "../GeneratorControls/GeneratorControls";

type ControlPanelProps = {
	config: GeneratorConfig;
	canExport: boolean;
	isExporting: boolean;
	exportProgress: number;
	onConfigChange: (config: GeneratorConfig) => void;
	onAnimationModeChange: (animationMode: AnimationMode) => void;
	onSavePng: () => void;
	onExportAnimation: () => void;
};

export const ControlPanel = ({
	config,
	canExport,
	isExporting,
	exportProgress,
	onConfigChange,
	onAnimationModeChange,
	onSavePng,
	onExportAnimation,
}: ControlPanelProps) => {
	const exportPercentage = Math.round(exportProgress * 100);

	return (
		<aside className="control-panel">
			<header className="panel-header">
				<span>Parameters</span>
			</header>

			<GeneratorControls
				config={config}
				onChange={onConfigChange}
				onAnimationModeChange={onAnimationModeChange}
			/>

			<section className="export-section">
				<h2>Export</h2>

				<div className="export-buttons">
					<button
						type="button"
						onClick={onSavePng}
						disabled={!canExport || isExporting}
					>
						Save PNG
					</button>

					<button
						type="button"
						onClick={onExportAnimation}
						disabled={!canExport || isExporting}
					>
						{isExporting
							? `Exporting ${exportPercentage}%`
							: "Export Animation ZIP"}
					</button>
				</div>
			</section>
		</aside>
	);
};
