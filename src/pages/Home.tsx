import styled from '@emotion/styled';

const Home = () => {
	return (
		<Container>
			<Title>Contributions in This Year</Title>
			<DayGrid>
				{Array.from({ length: 64 }, (_, idx) => (
					<Day key={idx} isActive={idx % 3 === 0} />
				))}
			</DayGrid>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const Title = styled.h2`
	width: 100%;
	font-size: var(--fz-h7);
	font-weight: var(--fw-black);
	color: var(--blue200);
`;

const DayGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(12, 1fr);
	gap: 8px;
	margin-top: 32px;
	padding: var(--padding-container-mobile);
	width: 100%;
	border: 1px solid var(--grey200);
	background: linear-gradient(270deg, var(--blue100), var(--greyOpacity100));
	border-radius: var(--radius-s);
`;

const Day = styled.span<{ isActive: boolean }>`
	display: inline-block;
	width: 20px;
	height: 20px;
	background-color: ${({ isActive }) => (isActive ? 'var(--black)' : 'var(--greyOpacity200)')};
	border-radius: var(--radius-xs);
`;

export default Home;
