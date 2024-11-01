import { Suspense } from 'react';
import styled from '@emotion/styled';
import { DiaryContent, DiaryContentLoader } from '../components';
import { routes } from '../constants';
import { Link } from 'react-router-dom';

const DiaryPage = () => {
	return (
		<section>
			<Header>
				<Title>💿 Records</Title>
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
	padding: calc(var(--padding-container-mobile) / 4) calc(var(--padding-container-mobile));
	min-width: 100px;
	min-height: 36px;
	background-color: var(--blue200);
	color: var(--white);
	font-size: var(--fz-p);
	font-weight: var(--fw-bold);
	border: 1px solid var(--blue300);
	border-radius: var(--radius-s);
	transition: background 0.3s ease-in-out outline 0.15s ease-in-out;

	&:hover,
	&:active {
		background-color: var(--blue300);
		outline: 1px solid var(--blue400);
		outline-offset: 2px;
	}
`;

export default DiaryPage;
