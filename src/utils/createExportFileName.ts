const formatNumber = (value: number): string => {
	return value.toString().padStart(2, "0");
};

export const createExportFileName = (extension: "png" | "zip"): string => {
	const now = new Date();

	const date = [
		now.getFullYear(),
		formatNumber(now.getMonth() + 1),
		formatNumber(now.getDate()),
	].join("-");

	const time = [
		formatNumber(now.getHours()),
		formatNumber(now.getMinutes()),
		formatNumber(now.getSeconds()),
	].join("-");

	return `parametric-mosaic-${date}-${time}.${extension}`;
};
