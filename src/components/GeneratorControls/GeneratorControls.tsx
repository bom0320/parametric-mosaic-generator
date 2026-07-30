import { useEffect, useRef } from "react";
import { Pane } from "tweakpane";
import type {
	GeneratorConfig,
	LuminanceSegment,
} from "../../generator/types/generator";

type GeneratorControlsProps = {
	config: GeneratorConfig;
	onChange: (config: GeneratorConfig) => void;
};

export const GeneratorControls = ({
	config,
	onChange,
}: GeneratorControlsProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const configRef = useRef(config);
	const onChangeRef = useRef(onChange);

	useEffect(() => {
		configRef.current = config;
	}, [config]);

	useEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);

	useEffect(() => {
		const container = containerRef.current;

		if (!container) {
			return;
		}

		const params: GeneratorConfig = structuredClone(configRef.current);

		const pane = new Pane({
			container,
			title: "Generator",
		});

		const updateConfig = () => {
			const nextConfig = structuredClone(params);

			configRef.current = nextConfig;
			onChangeRef.current(nextConfig);
		};

		const gridFolder = pane.addFolder({
			title: "Grid",
		});

		gridFolder
			.addBinding(params, "columns", {
				label: "Columns",
				min: 10,
				max: 120,
				step: 1,
			})
			.on("change", updateConfig);

		gridFolder
			.addBinding(params, "rows", {
				label: "Rows",
				min: 10,
				max: 120,
				step: 1,
			})
			.on("change", updateConfig);

		gridFolder
			.addBinding(params, "cellSize", {
				label: "Cell size",
				min: 4,
				max: 24,
				step: 1,
			})
			.on("change", updateConfig);

		gridFolder
			.addBinding(params, "gap", {
				label: "Gap",
				min: 0,
				max: 10,
				step: 1,
			})
			.on("change", updateConfig);

		gridFolder
			.addBinding(params, "mode", {
				label: "Mode",
				options: {
					Width: "width",
					Height: "height",
				},
			})
			.on("change", updateConfig);

		const segmentNames: LuminanceSegment[] = ["dark", "mid", "light"];

		for (const segmentName of segmentNames) {
			const segment = params.segments[segmentName];

			const segmentFolder = pane.addFolder({
				title: segmentName.charAt(0).toUpperCase() + segmentName.slice(1),
			});

			segmentFolder
				.addBinding(segment, "color", {
					label: "Color",
				})
				.on("change", updateConfig);
		}

		return () => {
			pane.dispose();
		};
	}, []);

	return <div ref={containerRef} className="generator-controls" />;
};
