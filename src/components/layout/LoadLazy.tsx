import { lazy, Suspense } from 'react';
import { LayoutLoadingSpinner } from './spinner';

const LoadLazy = (element: string) => {
	const LazyComponent = lazy(() => import(`../../pages/${element}.tsx`));

	return (
		<Suspense fallback={<LayoutLoadingSpinner />}>
			<LazyComponent />
		</Suspense>
	);
};

export default LoadLazy;
