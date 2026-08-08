import type {
	AnimationMode,
	GeneratorConfig,
} from "../../generator/types/generator";
import { GeneratorControls } from "../GeneratorControls/GeneratorControls";

type ControlPanelProps = {
	config: GeneratorConfig;
	onConfigChange: (config: GeneratorConfig) => void;
	onAnimationModeChange: (animationMode: AnimationMode) => void;
};

export const ControlPanel = ({
	config,
	onConfigChange,
	onAnimationModeChange,
}: ControlPanelProps) => {
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
		</aside>
	);
};
