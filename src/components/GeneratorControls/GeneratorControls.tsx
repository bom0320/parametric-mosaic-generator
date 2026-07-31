import { useEffect, useRef } from "react";
import { Pane } from "tweakpane";
import type { GeneratorConfig } from "../../generator/types/generator";

type GeneratorControlsProps = {
	config: GeneratorConfig;
	onChange: (config: GeneratorConfig) => void;
	onAnimate: () => void;
};

export const GeneratorControls = ({
	config,
	onChange,
	onAnimate,
}: GeneratorControlsProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const configRef = useRef(config);
	const onChangeRef = useRef(onChange);
	const onAnimateRef = useRef(onAnimate);

	useEffect(() => {
		configRef.current = config;
	}, [config]);

	useEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);

	useEffect(() => {
		onAnimateRef.current = onAnimate;
	}, [onAnimate]);

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
			.addBinding(params, "gap", {
				label: "Gap",
				min: 0,
				max: 2,
				step: 0.25,
			})
			.on("change", emitConfigChange);

		const imageFolder = pane.addFolder({
			title: "Image",
			expanded: true,
		});

		imageFolder
			.addBinding(params.imageAdjustments, "brightness", {
				label: "Brightness",
				min: -100,
				max: 100,
				step: 1,
			})
			.on("change", emitConfigChange);

		imageFolder
			.addBinding(params.imageAdjustments, "contrast", {
				label: "Contrast",
				min: -100,
				max: 100,
				step: 1,
			})
			.on("change", emitConfigChange);

		imageFolder
			.addBinding(params.imageAdjustments, "blur", {
				label: "Blur",
				min: 0,
				max: 7,
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

		blindsFolder
			.addBinding(params, "animationMode", {
				label: "Animation Mode",
				options: {
					Open: "open",
					Closed: "closed",
				},
			})
			.on("change", emitConfigChange);

		blindsFolder
			.addButton({
				title: "Animate",
			})
			.on("click", () => {
				onAnimateRef.current();
			});

		const paletteFolder = pane.addFolder({
			title: "Palette",
			expanded: true,
		});

		paletteFolder
			.addBinding(params.palette, "col1", {
				label: "col1",
			})
			.on("change", emitConfigChange);

		paletteFolder
			.addBinding(params.palette, "col2", {
				label: "col2",
			})
			.on("change", emitConfigChange);

		paletteFolder
			.addBinding(params.palette, "col3", {
				label: "col3",
			})
			.on("change", emitConfigChange);

		paletteFolder
			.addBinding(params.palette, "col4", {
				label: "col4",
			})
			.on("change", emitConfigChange);

		return () => {
			pane.dispose();
		};
	}, []);

	return <div ref={containerRef} className="generator-controls" />;
};
