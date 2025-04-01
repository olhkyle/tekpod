import { useSuspenseQuery } from '@tanstack/react-query';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { ExpenseTracker, getAllPaymentsByMonth } from '../../supabase';
import { queryKey } from '../../constants';
import { formatByKoreanTime, months } from '../../utils';
import { useMediaQuery } from '../../hooks';

interface ExpenseChartProps {
	selectMonth: (typeof months)[number];
}

const ExpenseChart = ({ selectMonth }: ExpenseChartProps) => {
	const { data: expenses } = useSuspenseQuery<ExpenseTracker[]>({
		queryKey: [...queryKey.EXPENSE_TRACKER, 'report', selectMonth],
		queryFn: () => getAllPaymentsByMonth(months.findIndex(month => month === selectMonth)),
	});

	const [isSmallMobile, isMediumMobile] = [useMediaQuery('(max-width: 320px)'), useMediaQuery('(max-width: 430px)')];

	const lineChartWidth = isSmallMobile ? 280 : isMediumMobile ? 380 : 440;

	const getTotalPricePerMonth = expenses.reduce<{ [date: string]: number }>((acc, curr) => {
		const formatDate = new Date(formatByKoreanTime(curr.usage_date)).getDate();

		if (!acc[formatDate]) {
			acc[formatDate] = 0;
		}

		acc[formatDate] += curr.price;
		return acc;
	}, {});

	const filteredData = Object.entries(getTotalPricePerMonth).map(([key, value]) => ({ date: +key, price: value }));

	return (
		<>
			<LineChart width={lineChartWidth} height={400} data={filteredData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
				<Line name="price" type="monotone" dataKey={'price'} stroke={'var(--black)'} />
				<CartesianGrid stroke="var(--grey200)" strokeDasharray="3 3" />
				<Tooltip
					labelFormatter={label => `${label}일`}
					wrapperStyle={{
						border: 'none',
						backgroundColor: 'var(--background)',
					}}
					labelStyle={{
						fontWeight: 'var(--fw-semibold)',
						color: 'var(--black)',
					}}
					contentStyle={{
						border: '1px solid var(--grey200)',
						borderRadius: '14px',
					}}
					itemStyle={{
						color: 'var(--grey900)',
						fontSize: 'var(--fz-sm)',
					}}
				/>
				<Legend align="right" verticalAlign="bottom" height={36} />
				<XAxis dataKey="date" />
				<YAxis dataKey="price" tickFormatter={value => `${Math.floor(value / 1000)}`} />
			</LineChart>
			<ul></ul>
		</>
	);
};

export default ExpenseChart;
