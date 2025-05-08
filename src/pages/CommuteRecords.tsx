import { Suspense, useState } from 'react';
import styled from '@emotion/styled';
import { LoadingSpinner, Records, Select, WorkInProgress } from '../components';
import { currentMonth, currentYear, months, years } from '../utils';

/**
 *
 * commute_records
 * {
 * 	id : uuid
 * user_id: string;
 * date: string;
 * status: 'present' | 'absent' | 'remote' | 'half_day';
 * workplace: string;
 * notes: boolean;
 * created_at: string;
 * updated_at: string;
 * }
 */

// TODO:
// 0 - update UI design for Calendar
// 1 - change Emoji with SVG
// 2 - add trigger with mutation

const CommuteRecordsPage = () => {
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
					data={months.filter((_, idx) => idx <= currentMonth).reverse()}
					placeholder={'Select Month'}
					descriptionLabel={'Month'}
					currentValue={yearAndMonth.month}
					onSelect={option => setYearAndMonth({ ...yearAndMonth, month: months[months.findIndex(month => month === option)] })}
				/>
			</Controller>

			<Suspense fallback={<LoadingSpinner />}>
				<Records yearAndMonth={yearAndMonth} />
			</Suspense>
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

export default CommuteRecordsPage;
