import { Suspense } from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { DiaryContent, DiaryContentLoader } from '../components';
import { routes } from '../constants';

const DiaryPage = () => {
	return (
		<section>
			<Header>
				<Title>💿 Records</Title>
				<WriteLink to={routes.WRITE}>WRITE</WriteLink>
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
	padding: calc(var(--padding-container-mobile) * 0.5) var(--padding-container-mobile);
	min-width: 80px;
	min-height: 40px;
	color: var(--white);
	font-size: var(--fz-p);
	font-weight: var(--fw-bold);
	background-color: var(--black);
	border-radius: var(--radius-s);
	transition: background 0.3s ease-in-out outline 0.15s ease-in-out;

	&:hover,
	&:active {
		background-color: var(--grey900);
	}
`;

export default DiaryPage;
