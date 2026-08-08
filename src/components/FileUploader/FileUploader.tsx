type FileUploaderProps = {
	onFileChange: (file: File | null) => void;
};

export const FileUploader = ({ onFileChange }: FileUploaderProps) => {
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0] ?? null;

		onFileChange(file);

		event.target.value = "";
	};

	return (
		<label className="file-uploader">
			<span>Upload Image</span>

			<input type="file" accept="image/*" onChange={handleChange} />
		</label>
	);
};
