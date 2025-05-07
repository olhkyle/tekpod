import { Suspense, useState } from 'react';
import styled from '@emotion/styled';
import { Description, ExpenseChart, ExpenseChartLoader, Select } from '../components';
import { currentMonth, months } from '../utils';

const ExpenseTrackerReportPage = () => {
	const [selectMonth, setSelectMonth] = useState(months[currentMonth]);

	return (
		<section>
			<Title>
				<span>Report of</span>
				<Select
					data={months.filter((_, idx) => idx <= currentMonth).reverse()}
					placeholder={'month'}
					currentValue={selectMonth}
					onSelect={option => setSelectMonth(months[months.findIndex(month => month === option)])}
				/>
			</Title>
			<Description>This chart will show price based on Korean WON(₩)</Description>
			<Suspense fallback={<ExpenseChartLoader />}>
				<ExpenseChart selectMonth={selectMonth} />
			</Suspense>
		</section>
	);
};

const Title = styled.h2`
	display: flex;
	gap: 8px;
	align-items: center;
	margin-bottom: 16px;
	font-size: var(--fz-h6);
	font-weight: var(--fw-black);
	color: var(--grey900);

	span[aria-label='month'] {
		color: var(--blue200);
	}
`;

export default ExpenseTrackerReportPage;
