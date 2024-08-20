import styled from '@emotion/styled';
import { Content } from '../components';
import { Suspense } from 'react';

const DiaryPage = () => {
	return (
		<section>
			<Title>💿 Records Of My Life</Title>
			<Suspense fallback={<div>Loading...</div>}>
				<Content />
			</Suspense>
		</section>
	);
};

const Title = styled.h2`
	font-size: var(--fz-h5);
	font-weight: var(--fw-black);
	color: var(--grey900);
`;

export default DiaryPage;
