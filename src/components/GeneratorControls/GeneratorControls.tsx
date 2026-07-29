import { useEffect, useRef } from "react";
import { Pane } from "tweakpane";
import type {
	GeneratorConfig,
	RenderMode,
} from "../../generator/types/generator";

type GeneratorControlsProps = {
	config: GeneratorConfig;
	onChange: (config: GeneratorConfig) => void;
};

type PaneParams = {
	columns: number;
	rows: number;
	cellSize: number;
	gap: number;
	mode: RenderMode;
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

		const params: PaneParams = {
			...configRef.current,
		};

		const pane = new Pane({
			container,
			title: "Generator",
		});

		const updateConfig = <Key extends keyof GeneratorConfig>(
			key: Key,
			value: GeneratorConfig[Key],
		) => {
			const nextConfig = {
				...configRef.current,
				[key]: value,
			};

			configRef.current = nextConfig;
			onChangeRef.current(nextConfig);
		};

		pane
			.addBinding(params, "columns", {
				label: "Columns",
				min: 10,
				max: 120,
				step: 1,
			})
			.on("change", (event) => {
				updateConfig("columns", event.value);
			});

		pane
			.addBinding(params, "rows", {
				label: "Rows",
				min: 10,
				max: 120,
				step: 1,
			})
			.on("change", (event) => {
				updateConfig("rows", event.value);
			});

		pane
			.addBinding(params, "cellSize", {
				label: "Cell size",
				min: 4,
				max: 24,
				step: 1,
			})
			.on("change", (event) => {
				updateConfig("cellSize", event.value);
			});

		pane
			.addBinding(params, "gap", {
				label: "Gap",
				min: 0,
				max: 10,
				step: 1,
			})
			.on("change", (event) => {
				updateConfig("gap", event.value);
			});

		pane
			.addBinding(params, "mode", {
				label: "Mode",
				options: {
					Width: "width",
					Height: "height",
				},
			})
			.on("change", (event) => {
				updateConfig("mode", event.value);
			});

		return () => {
			pane.dispose();
		};
	}, []);

	return <div ref={containerRef} className="generator-controls" />;
};
