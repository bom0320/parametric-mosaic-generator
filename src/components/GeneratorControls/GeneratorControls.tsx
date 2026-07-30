import { useEffect, useRef } from "react";
import { Pane } from "tweakpane";
import type { GeneratorConfig } from "../../generator/types/generator";

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

		const emitConfigChange = () => {
			const nextConfig = structuredClone(params);

			configRef.current = nextConfig;
			onChangeRef.current(nextConfig);
		};

		const gridFolder = pane.addFolder({
			title: "Grid",
			expanded: true,
		});

		gridFolder
			.addBinding(params, "tilesX", {
				label: "Tiles X",
				min: 10,
				max: 160,
				step: 1,
			})
			.on("change", emitConfigChange);

		gridFolder
			.addBinding(params, "tilesY", {
				label: "Tiles Y",
				min: 10,
				max: 160,
				step: 1,
			})
			.on("change", emitConfigChange);

		gridFolder
			.addBinding(params, "cellSize", {
				label: "Cell Size",
				min: 4,
				max: 24,
				step: 1,
			})
			.on("change", emitConfigChange);

		gridFolder
			.addBinding(params, "gap", {
				label: "Gap",
				min: 0,
				max: 10,
				step: 1,
			})
			.on("change", emitConfigChange);

		const blindsFolder = pane.addFolder({
			title: "Blinds",
			expanded: true,
		});

		blindsFolder
			.addBinding(params, "direction", {
				label: "Direction",
				options: {
					Horizontal: "horizontal",
					Vertical: "vertical",
				},
			})
			.on("change", emitConfigChange);

		const paletteFolder = pane.addFolder({
			title: "Palette",
			expanded: true,
		});

		paletteFolder
			.addBinding(params.segments.dark, "color", {
				label: "Color 1",
			})
			.on("change", emitConfigChange);

		paletteFolder
			.addBinding(params.segments.mid, "color", {
				label: "Color 2",
			})
			.on("change", emitConfigChange);

		paletteFolder
			.addBinding(params.segments.light, "color", {
				label: "Color 3",
			})
			.on("change", emitConfigChange);

		return () => {
			pane.dispose();
		};
	}, []);

	return <div ref={containerRef} className="generator-controls" />;
};
