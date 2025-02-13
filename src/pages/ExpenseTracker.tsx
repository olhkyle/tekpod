import { useState } from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSuspenseQuery } from '@tanstack/react-query';
import { MdUpcoming } from 'react-icons/md';
import { BsCalendar2MonthFill } from 'react-icons/bs';
import { months, currentMonth } from '../utils/date';
import queryKey from '../constants/queryKey';
import { getAllPaymentsByMonth } from '../supabase/expenseTracker';
import { monetizeWithSeparator } from '../utils/money';
import { matchedPriceUnitWithSymbol } from '../constants/expenseTracker';
import type { MatchedPriceUnitWithSymbol } from '../constants/expenseTracker';
import { routes } from '../constants';
import { Select } from '../components';

const linkGroup = [
	{
		to: `${routes.EXPENSE_TRACKER}/daily`,
		icon: <BsCalendar2MonthFill size="18" color="var(--blue100)" />,
		title: 'Daily Transaction',
	},
	{
		to: `${routes.EXPENSE_TRACKER}/upcoming`,
		icon: <MdUpcoming size="18" color="var(--blue100)" />,
		title: 'Upcoming Transaction',
	},
];

const ExpenseTracker = () => {
	const [targetMonth, setTargetMonth] = useState<string>(months[currentMonth]); // Jan ~

	const { data } = useSuspenseQuery({
		queryKey: [...queryKey.EXPENSE_TRACKER, currentMonth], // 0 ~ 11
		queryFn: () => getAllPaymentsByMonth(currentMonth), // 0 ~ 11
	});

	return (
		<section>
			<TotalExpense>
				<Flex direction={'row'} alignItems={'center'}>
					<div>How much I spend on</div>
					<Select
						data={months}
						placeholder="Select Month"
						descriptionLabel="Month"
						currentValue={targetMonth}
						onSelect={option => setTargetMonth(months[months.findIndex(month => month === option)])}
					/>
				</Flex>
				<PriceList>
					{Object.entries(data).map(([priceUnit, price], idx) => (
						<Price key={`${price}_${priceUnit}_${idx}`}>
							<span>{matchedPriceUnitWithSymbol[priceUnit as keyof MatchedPriceUnitWithSymbol]}</span>
							<span>{monetizeWithSeparator(price + '')}</span>
						</Price>
					))}
				</PriceList>
			</TotalExpense>
			<Flex direction={'column'} alignItems={'flex-start'}>
				{linkGroup.map(({ to, icon, title }) => (
					<Link to={to} key={title}>
						<StyledMotion
							initial="rest"
							whileTap={{
								scale: 0.95,
								transition: { duration: 0.2 },
							}}>
							<IconBackground>{icon}</IconBackground>
							<span>{title}</span>
						</StyledMotion>
					</Link>
				))}
			</Flex>
		</section>
	);
};

const TotalExpense = styled.div`
	margin-bottom: 16px;
	padding: var(--padding-container-mobile);
	color: var(--white);
	background-color: var(--black);
	border: 1px solid var(--grey100);
	border-radius: var(--radius-l);
`;

const Flex = styled.div<{
	direction: 'row' | 'column';
	alignItems: 'flex-start' | 'center' | 'flex-end';
}>`
	display: flex;
	flex-direction: ${({ direction }) => direction};
	align-items: ${({ alignItems }) => alignItems};
	gap: 8px;

	a {
		width: 100%;
	}
`;

const PriceList = styled.ul`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;

const Price = styled.li`
	display: flex;
	font-size: var(--fz-h5);
	font-weight: var(--fw-black);
`;

const StyledMotion = styled(motion.div)`
	display: flex;
	align-items: center;
	gap: 12px;
	padding: var(--padding-container-mobile);
	width: 100%;
	background-color: var(--blue100);
	border-radius: var(--radius-m);
	font-weight: var(--fw-semibold);
`;

const IconBackground = styled.div`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	width: 32px;
	height: 32px;
	background-color: var(--blue300);
	border-radius: var(--radius-s);
`;

export default ExpenseTracker;
