import { useEffect, useRef } from "react";
import { Pane } from "tweakpane";
import type { GeneratorConfig } from "../../generator/types/generator";

type GeneratorControlsProps = {
	config: GeneratorConfig;
	onChange: (config: GeneratorConfig) => void;
	onAnimate: () => void;
	animationCompletedId: number;
};

export const GeneratorControls = ({
	config,
	onChange,
	onAnimate,
	animationCompletedId,
}: GeneratorControlsProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const configRef = useRef(config);
	const onChangeRef = useRef(onChange);
	const onAnimateRef = useRef(onAnimate);

	const paramsRef = useRef<GeneratorConfig | null>(null);
	const paneRef = useRef<Pane | null>(null);
	const previousCompletedIdRef = useRef(animationCompletedId);

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
		if (animationCompletedId === previousCompletedIdRef.current) {
			return;
		}

		previousCompletedIdRef.current = animationCompletedId;

		const params = paramsRef.current;
		const pane = paneRef.current;

		if (!params || !pane) {
			return;
		}

		/*
		 * 애니메이션이 끝난 뒤 드롭다운 표시만 Open으로 바꾼다.
		 * onChange를 호출하지 않으므로 Open 애니메이션은 실행되지 않는다.
		 */
		params.animationMode = "open";
		pane.refresh();
	}, [animationCompletedId]);

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

		paramsRef.current = params;
		paneRef.current = pane;

		const emitConfigChange = () => {
			const nextConfig = structuredClone(params);

			configRef.current = nextConfig;
			onChangeRef.current(nextConfig);
		};

		const handleAnimationModeChange = () => {
			if (params.animationMode === "animate") {
				/*
				 * Animate 표시를 유지한 상태로
				 * 일회성 애니메이션을 시작한다.
				 */
				onAnimateRef.current();
				return;
			}

			emitConfigChange();
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
					Animate: "animate",
				},
			})
			.on("change", handleAnimationModeChange);

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

			paramsRef.current = null;
			paneRef.current = null;
		};
	}, []);

	return <div ref={containerRef} className="generator-controls" />;
};
