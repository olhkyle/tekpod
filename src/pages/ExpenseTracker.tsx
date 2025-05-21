import { Suspense, useState } from 'react';
import styled from '@emotion/styled';
import { Link, useNavigate } from 'react-router-dom';
import { MdUpcoming } from 'react-icons/md';
import { IoCardOutline } from 'react-icons/io5';
import { BsCalendar2MonthFill } from 'react-icons/bs';
import { Button, Select, ShrinkMotionBlock, TotalExpensePrice, TotalExpensePriceLoader, MODAL_CONFIG } from '../components';
import { useModalStore } from '../store';
import { routes } from '../constants';
import { type Month, months, currentMonth, currentYear, getMonthIndexFromMonths } from '../utils';

const linkGroup = [
	{
		to: `${routes.EXPENSE_TRACKER}/daily`,
		icon: <BsCalendar2MonthFill size="18" color="var(--blue100)" />,
		title: 'Daily Transaction',
	},
	{
		to: `${routes.EXPENSE_TRACKER}/credit_card`,
		icon: <IoCardOutline size="18" color="var(--blue100)" />,
		title: 'Credit Card Transaction',
	},
	{
		to: `${routes.EXPENSE_TRACKER}/upcoming`,
		icon: <MdUpcoming size="18" color="var(--blue100)" />,
		title: 'Upcoming Transaction',
	},
];

const ExpenseTrackerPage = () => {
	const [targetMonth, setTargetMonth] = useState<Month>(months[currentMonth]); // Jan ~ Dec
	const currentMonthIndex = getMonthIndexFromMonths(targetMonth);

	const navigate = useNavigate();
	const { setModal } = useModalStore();

	const handleAddPaymentModal = () => {
		setModal({
			Component: MODAL_CONFIG.EXPENSE_TRACKER.ADD.Component,
			props: {
				type: MODAL_CONFIG.EXPENSE_TRACKER.ADD.type,
				data: null,
			},
		});
	};
	return (
		<section>
			<TotalExpense>
				<TotalExpenseContent>
					<Flex direction={'row'} alignItems={'center'} gap={8}>
						<h2>Total Expenses</h2>
						<Select
							data={months.filter((_, idx) => idx <= currentMonth).reverse()}
							placeholder="Select Month"
							descriptionLabel="Month"
							currentValue={targetMonth}
							onSelect={option => setTargetMonth(months[getMonthIndexFromMonths(option)])}
						/>
						<span>in {currentYear}</span>
					</Flex>
					<Suspense fallback={<TotalExpensePriceLoader />}>
						<TotalExpensePrice currentMonthIndex={currentMonthIndex} />
					</Suspense>
				</TotalExpenseContent>
				<Flex direction={'row'} alignItems={'center'} gap={0}>
					<AddNewExpenseButton type="button" onClick={handleAddPaymentModal}>
						Add Expense
					</AddNewExpenseButton>
					<PersonalExpenseLink type="button" onClick={() => navigate(routes.EXPENSE_TRACKER_REPORT)}>
						Expense Report
					</PersonalExpenseLink>
				</Flex>
			</TotalExpense>
			<Flex direction={'column'} alignItems={'flex-start'} gap={8}>
				{linkGroup.map(({ to, icon, title }) => (
					<Link to={to} key={title}>
						<StyledShrinkMotionBlock>
							<IconBackground>{icon}</IconBackground>
							<span>{title}</span>
						</StyledShrinkMotionBlock>
					</Link>
				))}
			</Flex>
		</section>
	);
};

const TotalExpense = styled.div`
	margin-bottom: 16px;
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
	gap: number;
}>`
	display: flex;
	flex-direction: ${({ direction }) => direction};
	align-items: ${({ alignItems }) => alignItems};
	gap: ${({ gap }) => `${gap}px`};

	a {
		width: 100%;
	}

	span {
		font-weight: var(--fw-semibold);
	}
`;

const AddNewExpenseButton = styled(Button)`
	padding: var(--padding-container-mobile);
	width: 100%;
	background-color: var(--grey100);
	color: var(--black);
	font-size: var(--fz-p);
	font-weight: var(--fw-semibold);
	border-radius: 0 0 0 var(--radius-l);
`;

const PersonalExpenseLink = styled(Button)`
	padding: var(--padding-container-mobile);
	width: 100%;
	background-color: var(--grey200);
	color: var(--black);
	font-size: var(--fz-p);
	font-weight: var(--fw-semibold);
	border-radius: 0 0 var(--radius-l) 0;
	text-align: center;
`;

const StyledShrinkMotionBlock = styled(ShrinkMotionBlock)`
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

export default ExpenseTrackerPage;
