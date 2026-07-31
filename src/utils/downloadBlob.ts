export const downloadBlob = (blob: Blob, fileName: string): void => {
	const objectUrl = URL.createObjectURL(blob);
	const link = document.createElement("a");

	link.href = objectUrl;
	link.download = fileName;

	document.body.appendChild(link);
	link.click();
	link.remove();

	URL.revokeObjectURL(objectUrl);
};
