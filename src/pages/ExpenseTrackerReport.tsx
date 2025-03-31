import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { queryKey } from '../constants';
import { ExpenseTracker, getAllPaymentsByMonth } from '../supabase';
import { currentMonth, formatByKoreanTime, months } from '../utils';
import { useMediaQuery } from '../hooks';

const ExpenseTrackerReportPage = () => {
	const { data } = useSuspenseQuery<ExpenseTracker[]>({
		queryKey: queryKey.EXPENSE_TRACKER,
		queryFn: () => getAllPaymentsByMonth(currentMonth),
	});

	const isSmallMobile = useMediaQuery('(max-width: 320px)');
	const isMediumMobile = useMediaQuery('(max-width: 430px)');

	const getTotalPricePerMonth = data.reduce<{ [date: string]: number }>((acc, curr) => {
		const formatDate = new Date(formatByKoreanTime(curr.usage_date)).getDate();

		if (!acc[formatDate]) {
			acc[formatDate] = 0;
		}

		acc[formatDate] += +`${curr.priceIntegerPart}.${curr.priceDecimalPart}`;
		return acc;
	}, {});

	const filteredData = Object.entries(getTotalPricePerMonth)
		.map(([key, value]) => ({ date: key, price: value }))
		.sort((prev, curr) => +prev.date - +curr.date);

	return (
		<section>
			<Title>
				<span>Report of</span>
				<span aria-label="month">{months[currentMonth]}</span>
			</Title>
			<LineChart
				width={isSmallMobile ? 280 : isMediumMobile ? 380 : 440}
				height={400}
				data={filteredData}
				margin={{ top: 0, right: 10, left: -20, bottom: 5 }}>
				<Line name="price (n만원)" type="monotone" dataKey={'price'} stroke={'var(--black)'} />
				<CartesianGrid stroke="var(--grey200)" strokeDasharray="3 3" />
				<Tooltip labelFormatter={label => `${label}일`} labelStyle={{ fontWeight: 'var(--fw-medium)' }} />
				<Legend align="right" verticalAlign="bottom" height={36} />
				<XAxis dataKey="date" />
				<YAxis dataKey="price" tickFormatter={value => `${Math.floor(value / 10000)}`} />
			</LineChart>
		</section>
	);
};

const Title = styled.h2`
	display: flex;
	gap: 4px;
	align-items: center;
	margin-bottom: 16px;
	font-size: var(--fz-h5);
	font-weight: var(--fw-black);
	color: var(--grey900);

	span[aria-label='month'] {
		color: var(--blue200);
	}
`;

export default ExpenseTrackerReportPage;
