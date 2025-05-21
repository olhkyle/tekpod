import { Suspense } from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { DiaryContent, DiaryContentLoader, FloatingActionButton } from '../components';
import { routes } from '../constants';

const DiaryPage = () => {
	return (
		<section>
			<Header>
				<Title>💿 Records</Title>
			</Header>
			<Suspense fallback={<DiaryContentLoader />}>
				<DiaryContent />
			</Suspense>
			<FloatingActionButton variant={'link'}>
				<WriteLink to={routes.WRITE}>Write</WriteLink>
			</FloatingActionButton>
		</section>
	);
};

const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const Title = styled.h2`
	font-size: var(--fz-h5);
	font-weight: var(--fw-black);
	color: var(--grey900);
`;

const WriteLink = styled(Link)`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	max-height: 50.5px;
	color: var(--white);
	font-size: var(--fz-p);
	font-weight: var(--fw-bold);
	background-color: var(--black);

	&:hover,
	&:active {
		background-color: var(--grey900);
	}
`;

export default DiaryPage;
