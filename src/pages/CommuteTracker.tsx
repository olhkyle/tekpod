import { useState } from 'react';
import styled from '@emotion/styled';
import { calendar, currentMonth, currentYear, months, years } from '../utils';
import { Select, WorkInProgress } from '../components';

const CommuteTrackerPage = () => {
	const [yearAndMonth, setYearAndMonth] = useState({
		year: `${currentYear}`,
		month: months[currentMonth],
	});

	return (
		<Container>
			<Title id="commute-tracker-page-title">Commute Tracker</Title>
			<Controller>
				<Select
					data={years}
					placeholder={'Select Year'}
					descriptionLabel={'Year'}
					currentValue={yearAndMonth.year}
					onSelect={option => setYearAndMonth({ ...yearAndMonth, year: option })}
				/>
				<Select
					data={months.filter((_, idx) => idx <= currentMonth)}
					placeholder={'Select Month'}
					descriptionLabel={'Month'}
					currentValue={yearAndMonth.month}
					onSelect={option => setYearAndMonth({ ...yearAndMonth, month: months[months.findIndex(month => month === option)] })}
				/>
			</Controller>
			<Checker>
				{calendar[months.findIndex(month => month === yearAndMonth.month) + 1].map(day => (
					<li key={day}>
						<div>{day}</div>
					</li>
				))}
			</Checker>
			<WorkInProgress />
		</Container>
	);
};

const Container = styled.section``;

const Title = styled.h2`
	font-size: var(--fz-h5);
	font-weight: var(--fw-black);
`;

const Controller = styled.div`
	display: flex;
	align-items: center;
	gap: 16px;
	margin-top: 16px;
	padding: calc(var(--padding-container-mobile) * 0.5);
	background-color: var(--black);
	border-radius: var(--radius-s);
`;

const Checker = styled.ul`
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	gap: 8px;
	margin: 32px auto;

	li {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		min-width: 48px;
		min-height: 48px;
		color: var(--grey600);
		background-color: var(--grey100);
		border-radius: var(--radius-s);
		cursor: pointer;

		@media screen and (min-width: 640px) {
			min-height: 60px;
		}
	}
`;

export default CommuteTrackerPage;
