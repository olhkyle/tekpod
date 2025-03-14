import { Suspense } from 'react';
import styled from '@emotion/styled';
import { ContentBody, ContentBodyLoader } from '../components';

const DiaryContentPage = () => {
	return (
		<Container>
			<Suspense fallback={<ContentBodyLoader />}>
				<ContentBody />
			</Suspense>
		</Container>
	);
};

const Container = styled.section`
	position: relative;
	display: flex;
	flex-direction: column;
	width: 100%;
	height: calc(100dvh - (3 * var(--nav-height)));
`;

export default DiaryContentPage;
