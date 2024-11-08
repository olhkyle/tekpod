import { useEffect, useRef, useState } from 'react';

const useIsElementInViewport = (options?: IntersectionObserverInit) => {
	const elementRef = useRef<HTMLImageElement | null>(null);
	const [isVisible, setIsVisible] = useState<boolean>(false);

	const callback = (entries: IntersectionObserverEntry[]) => {
		const [firstEntry] = entries;

		setIsVisible(firstEntry.isIntersecting);
	};

	useEffect(() => {
		const observer = new IntersectionObserver(callback, options);

		if (elementRef && elementRef.current) {
			observer.observe(elementRef.current);
		}

		return () => observer.disconnect();
	}, [elementRef, options]);

	return { elementRef, isVisible };
};

export default useIsElementInViewport;
