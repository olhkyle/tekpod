import { Suspense } from 'react';
import { Content } from '../components';

const Diary = () => {
	return (
		<Suspense fallback={<div>Loading... Loading... Loading... Loading...</div>}>
			<Content />
		</Suspense>
	);
};

export default Diary;
