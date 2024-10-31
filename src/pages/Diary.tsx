import { Suspense } from 'react';
import styled from '@emotion/styled';
import { DiaryContent, DiaryContentLoader } from '../components';
import { routes } from '../constants';
import { Link } from 'react-router-dom';

const DiaryPage = () => {
	return (
		<section>
			<Header>
				<Title>💿 Records Of My Life</Title>
				<WriteLink to={routes.WRITE}>Write</WriteLink>
			</Header>
			<Suspense fallback={<DiaryContentLoader />}>
				<DiaryContent />
			</Suspense>
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
	padding: calc(var(--padding-container-mobile) / 4) calc(var(--padding-container-mobile) / 2);
	min-height: 36px;
	background-color: var(--blue100);
	color: var(--blue200);
	font-weight: var(--fw-semibold);
	border: 1px solid var(--blue300);
	border-radius: var(--radius-s);

	&:hover {
		background-color: var(--blue300);
	}
`;

export default DiaryPage;
