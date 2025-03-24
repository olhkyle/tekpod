import { useEffect, useState } from 'react';
import { useIsElementInViewport } from '.';

const ROOT_MARGIN = '0px 0px 150px 0px';

const useIsImageLoaded = (lazy: boolean) => {
	const { elementRef, isVisible } = useIsElementInViewport({
		rootMargin: ROOT_MARGIN,
	});

	const [isLoaded, setIsLoaded] = useState(!lazy); // the state to make image loading to being lazy
	// loaded = true =>  show all images to be shown

	useEffect(() => {
		if (isLoaded && !isVisible) return;

		setIsLoaded(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isVisible]);

	return { elementRef, isLoaded };
};

export default useIsImageLoaded;
