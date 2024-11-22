import styled from '@emotion/styled';
// import { useQuery } from '@tanstack/react-query';
// import { getCommitStatus } from '../supabase/diary';

const HomePage = () => {
	// const { data } = useQuery({ queryKey: ['commits'], queryFn: getCommitStatus });

	// console.log(`오늘은 올해의 ${dayOfYear}번째 날입니다.`);
	const days = Array.from({ length: 365 }, (_, idx) => idx + 1);
	const daysByDivider = days.reduce<number[][]>((acc, _, i) => {
		if (i % 7 === 0) acc.push(days.slice(i, i + 7));
		return acc;
	}, []);

	return (
		<Container>
			<Title>✹ Contributions</Title>
			<DayGrid>
				{daysByDivider.map((arr, group_idx) => (
					<div key={group_idx}>
						{arr.map((item, idx) => (
							<Day key={item} isActive={idx % 3 === 0} />
						))}
					</div>
				))}
			</DayGrid>
		</Container>
	);
};

const Container = styled.section`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const Title = styled.h2`
	width: 100%;
	font-size: var(--fz-h6);
	font-weight: var(--fw-black);
`;

const DayGrid = styled.div`
	display: flex;
	justify-content: space-between;
	gap: 4px;
	margin-top: 16px;
	padding: calc(var(--padding-container-mobile) / 2);
	width: 100%;
	border: 1px solid var(--grey200);
	background: linear-gradient(270deg, var(--blue100), var(--greyOpacity100));
	border-radius: var(--radius-s);
	overflow-x: scroll;

	div {
		display: flex;
		flex-direction: column;
		gap: 4px;
		/* min-width: 24px; */

		span {
			font-size: var(--fz-xs);
		}
	}
`;

const Day = styled.span<{ isActive: boolean }>`
	display: inline-flex;
	width: 100%; // 부모 그리드 셀에 맞춤
	min-width: 10px; // 최소 크기 보장
	max-width: 16px; // 최대 크기 제한
	aspect-ratio: 1;
	background-color: ${({ isActive }) => (isActive ? 'var(--black)' : 'var(--greyOpacity200)')};
	border-radius: var(--radius-xs);
`;

export default HomePage;
