const imageCache = new Map<string, Promise<void>>();
const loadedImages = new Set<string>();

const loadImage = (src: string) => {
	return new Promise<void>((resolve, reject) => {
		const image = new window.Image();
		image.src = src;
		image.onload = () => {
			loadedImages.add(src);
			resolve();
		};
		image.onerror = reject;
	});
};

const suspendImage = (src: string) => {
	if (loadedImages.has(src)) {
		return;
	}

	if (!imageCache.has(src)) {
		imageCache.set(src, loadImage(src));
	}

	throw imageCache.get(src);
};

export default suspendImage;
