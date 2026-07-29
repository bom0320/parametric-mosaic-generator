import { useMemo } from "react";
import { sampleImage } from "../../generator/core/sampleImage";

type SamplingPreviewProps = {
	image: HTMLImageElement | null;
	columns?: number;
	rows?: number;
};

export const SamplingPreview = ({
	image,
	columns = 60,
	rows = 40,
}: SamplingPreviewProps) => {
	const cells = useMemo(() => {
		if (!image) {
			return [];
		}

		return sampleImage(image, {
			columns,
			rows,
		});
	}, [image, columns, rows]);

	if (!image) {
		return null;
	}

	return (
		<section className="sampling-preview">
			<div className="sampling-preview-header">
				<h2>Sampling Preview</h2>
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
				{cells.map((cell) => {
					const { red, green, blue, alpha } = cell.color;

					return (
						<div
							key={`${cell.column}-${cell.row}`}
							className="sampling-cell"
							style={{
								backgroundColor: `rgba(${red}, ${green}, ${blue}, ${
									alpha / 255
								})`,
							}}
							title={`(${cell.column}, ${cell.row}) rgb(${red}, ${green}, ${blue})`}
						/>
					);
				})}
			</div>
		</section>
	);
};
