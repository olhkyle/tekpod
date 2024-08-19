import { Suspense } from 'react';
import { Content, LoadingSpinner } from '../components';

const Diary = () => {
	return (
		<Suspense fallback={<LoadingSpinner />}>
			<Content />
		</Suspense>
	);
};

export default Diary;
