export type RGBColor = {
	red: number;
	green: number;
	blue: number;
	alpha: number;
};

export type BlindDirection = "horizontal" | "vertical";

export type AnimationMode = "open" | "close";

export type ImageAdjustments = {
	brightness: number;
	contrast: number;
	blur: number;
};

export type Palette = {
	col1: string;
	col2: string;
	col3: string;
	col4: string;
};

export type GeneratorConfig = {
	tilesX: number; // 이미지를 가로로 몇 칸 분석할지
	tilesY: number; // 이미지를 세로로 몇 칸 분석할지
	gap: number; // 각 셀 안 도형 사이의 간격
	direction: BlindDirection; // width 또는 height 중 어느 방향을 변형할지
	animationMode: AnimationMode; // 도형을 열거나 닫는 애니메이션 방식
	imageAdjustments: ImageAdjustments; // 밝기, 대비, 블러 설정
	palette: Palette; // 결과에 사용할 네 가지 색상
};

export type SampledCell = {
	column: number;
	row: number;
	color: RGBColor;
	luminance: number;
};
