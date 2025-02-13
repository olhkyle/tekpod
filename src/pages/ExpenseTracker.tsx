import { useState } from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSuspenseQuery } from '@tanstack/react-query';
import { MdUpcoming } from 'react-icons/md';
import { BsCalendar2MonthFill } from 'react-icons/bs';
import { getAllPaymentsByMonth } from '../supabase/expenseTracker';
import { Button, Select } from '../components';
import { monetizeWithSeparator } from '../utils/money';
import { months, currentMonth } from '../utils/date';
import queryKey from '../constants/queryKey';
import { matchedPriceUnitWithSymbol } from '../constants/expenseTracker';
import type { MatchedPriceUnitWithSymbol } from '../constants/expenseTracker';
import { routes } from '../constants';
import useModalStore from '../store/useModalStore';
import { MODAL_CONFIG } from '../components/modal/modalType';

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

	// months ['Jan', 'Feb' , ']
	const currentMonthIndex = months.findIndex(month => month === targetMonth);

	const { data } = useSuspenseQuery({
		queryKey: [...queryKey.EXPENSE_TRACKER, currentMonthIndex], // 0 ~ 11
		queryFn: () => getAllPaymentsByMonth(currentMonthIndex), // 0 ~ 11
	});

	const { setModal } = useModalStore();

	const handleAddPaymentModal = () => {
		setModal({
			Component: MODAL_CONFIG.FINANCIAL_LEDGER.ADD.Component,
			props: {
				type: MODAL_CONFIG.FINANCIAL_LEDGER.ADD.type,
				data: null,
			},
		});
	};
	return (
		<section>
			<TotalExpense>
				<TotalExpenseContent>
					<Flex direction={'row'} alignItems={'center'} gap="8px">
						<div>How much I spend on</div>
						<Select
							data={months}
							placeholder="Select Month"
							descriptionLabel="Month"
							currentValue={targetMonth}
							onSelect={option => setTargetMonth(months[months.findIndex(month => month === option)])}
						/>
					</Flex>
					{data.price === 0 ? (
						<Price>
							<span>₩</span>
							<span>{monetizeWithSeparator(data.price + '')}</span>
						</Price>
					) : (
						<PriceList>
							{Object.entries(data).map(([priceUnit, price], idx) => (
								<Price key={`${price}_${priceUnit}_${idx}`}>
									<span>{matchedPriceUnitWithSymbol[priceUnit as keyof MatchedPriceUnitWithSymbol]}</span>
									<span>{monetizeWithSeparator(price + '')}</span>
								</Price>
							))}
						</PriceList>
					)}
				</TotalExpenseContent>
				<Flex direction="row" alignItems="center" gap="0px">
					<AddNewExpenseButton type="button" onClick={handleAddPaymentModal}>
						Add New Expense
					</AddNewExpenseButton>
					<WipButton type="button" onClick={handleAddPaymentModal}>
						🤔
					</WipButton>
				</Flex>
			</TotalExpense>
			<Flex direction={'column'} alignItems={'flex-start'} gap="8px">
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
	border: 1px solid var(--grey100);
	border-radius: var(--radius-l);
`;

const TotalExpenseContent = styled.div`
	padding: var(--padding-container-mobile);
	color: var(--white);
	background-color: var(--grey900);
	border-radius: var(--radius-l) var(--radius-l) 0 0;
`;

const Flex = styled.div<{
	direction: 'row' | 'column';
	alignItems: 'flex-start' | 'center' | 'flex-end';
	gap: `${number}px`;
}>`
	display: flex;
	flex-direction: ${({ direction }) => direction};
	align-items: ${({ alignItems }) => alignItems};
	gap: ${({ gap }) => gap};

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
	font-size: var(--fz-h4);
	font-weight: var(--fw-black);
`;

const AddNewExpenseButton = styled(Button)`
	padding: var(--padding-container-mobile);
	width: 100%;
	background-color: var(--grey100);
	color: var(--black);
	font-weight: var(--fw-semibold);
	border-radius: 0 0 0 var(--radius-l);
`;

const WipButton = styled(Button)`
	padding: var(--padding-container-mobile);
	width: 100%;
	background-color: var(--grey200);
	color: var(--black);
	font-weight: var(--fw-semibold);
	border-radius: 0 0 var(--radius-l) 0;
`;

const StyledMotion = styled(motion.div)`
	display: flex;
	align-items: center;
	gap: 12px;
	padding: var(--padding-container-mobile);
	width: 100%;
	background-color: var(--blue100);
	color: var(--grey900);
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
