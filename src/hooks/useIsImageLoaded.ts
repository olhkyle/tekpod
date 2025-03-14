import { useEffect, useState } from 'react';
import { useIsElementInViewport } from '.';

const ROOT_MARGIN = '0px 0px 150px 0px';

const useIsImageLoaded = (lazy: boolean) => {
	const { elementRef, isVisible } = useIsElementInViewport({
		rootMargin: ROOT_MARGIN,
	});

	const [isLoaded, setIsLoaded] = useState(!lazy); // lazy하게 이미지를 loading하기 위한 상태, loaded = true인 경우 보여줘야 할 이미지를 보여주도록 함

	useEffect(() => {
		if (isLoaded && !isVisible) return;

		setIsLoaded(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isVisible]);

	return { elementRef, isLoaded };
};

export default useIsImageLoaded;
