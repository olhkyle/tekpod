import styled from '@emotion/styled';
import { Content, ContentLoader } from '../components';
import { Suspense } from 'react';

const DiaryPage = () => {
	return (
		<section>
			<Title>💿 Records Of My Life</Title>
			<Suspense fallback={<ContentLoader />}>
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
