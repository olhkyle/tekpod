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
	margin-bottom: 80px;
	width: 100%;

	@media screen and (min-width: 640px) {
		height: calc(100dvh - 2 * var(--nav-height) - 2 * var(--padding-container-mobile));
	}
`;

export default DiaryContentPage;
