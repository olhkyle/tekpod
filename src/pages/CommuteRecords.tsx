import { Suspense, useState } from 'react';
import styled from '@emotion/styled';
import { Records, RecordsLoader, Select, WorkInProgress } from '../components';
import { currentMonth, currentYear, getMonthIndexFromMonths, months, years } from '../utils';

const CommuteRecordsPage = () => {
	const [yearAndMonth, setYearAndMonth] = useState({
		year: `${currentYear}`,
		month: months[currentMonth],
	});

	return (
		<section>
			<Title id="commute-tracker-page-title">Commute Tracker</Title>
			<Controller>
				<Select
					data={years}
					placeholder={'Select Year'}
					descriptionLabel={'Year'}
					currentValue={yearAndMonth.year}
					onSelect={option =>
						setYearAndMonth({
							...yearAndMonth,
							year: option,
							month: getMonthIndexFromMonths(yearAndMonth.month) >= currentMonth ? months[currentMonth] : yearAndMonth.month,
						})
					}
				/>
				<Select
					data={+yearAndMonth.year === currentYear ? months.filter((_, idx) => idx <= currentMonth) : [...months].reverse()}
					placeholder={'Select Month'}
					descriptionLabel={'Month'}
					currentValue={yearAndMonth.month}
					onSelect={option => setYearAndMonth({ ...yearAndMonth, month: months[getMonthIndexFromMonths(option)] })}
				/>
			</Controller>

			<Suspense fallback={<RecordsLoader />}>
				<Records yearAndMonth={yearAndMonth} />
			</Suspense>
			<WorkInProgress />
		</section>
	);
};

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

export default CommuteRecordsPage;
