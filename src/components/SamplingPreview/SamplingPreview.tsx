import { useMemo } from "react";
import { sampleImage } from "../../generator/core/sampleImage";
import { segmentColorMap } from "../../generator/core/segmentColorMap";
import type { ImageAdjustments } from "../../generator/types/generator";

type SamplingPreviewProps = {
	image: HTMLImageElement | null;
	columns?: number;
	rows?: number;
	adjustments: ImageAdjustments;
};

export const SamplingPreview = ({
	image,
	columns = 60,
	rows = 40,
	adjustments,
}: SamplingPreviewProps) => {
	const cells = useMemo(() => {
		if (!image) {
			return [];
		}

		return sampleImage(image, {
			columns,
			rows,
			adjustments,
		});
	}, [image, columns, rows, adjustments]);

	if (!image) {
		return null;
	}

	return (
		<section className="sampling-preview">
			<div className="sampling-preview-header">
				<h2>Luminance Preview</h2>

				<span>
					{columns} × {rows} · {cells.length} cells
				</span>
			</div>

			<div
				className="sampling-grid"
				style={{
					gridTemplateColumns: `repeat(${columns}, 1fr)`,
					aspectRatio: `${columns} / ${rows}`,
				}}
			>
				{cells.map((cell) => (
					<div
						key={`${cell.column}-${cell.row}`}
						className="sampling-cell"
						style={{
							backgroundColor: segmentColorMap[cell.segment],
						}}
						title={`(${cell.column}, ${cell.row}) luminance: ${cell.luminance} · ${cell.segment}`}
					/>
				))}
			</div>
		</section>
	);
};
