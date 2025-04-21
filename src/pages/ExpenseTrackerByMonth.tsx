import { Suspense, useState } from 'react';
import styled from '@emotion/styled';
import { useLocation } from 'react-router-dom';
import { DatePicker, PaymentItemLoader, PaymentList, SegmentedControl, Select, MODAL_CONFIG } from '../components';
import { useModalStore } from '../store';
import { priceUnit, PriceUnitType } from '../constants';
import { today } from '../utils';

export type ExtendedPaymentMethodType = (typeof segmentedControlOptions)[number];
const segmentedControlOptions = ['All', 'Card', 'Cash'] as const;

const ExpenseTrackerByMonthPage = () => {
	const { state } = useLocation() as { state: { currentDate: Date } };
	const [selected, setSelected] = useState<Date>(state?.currentDate ?? today);
	const { setModal } = useModalStore();

	const [currentPaymentMethod, setCurrentPaymentMethod] = useState<ExtendedPaymentMethodType>(segmentedControlOptions[0]);
	const [currentPriceUnit, setCurrentPriceUnit] = useState<PriceUnitType>('WON');

	const handleAddPaymentModal = () => {
		setModal({
			Component: MODAL_CONFIG.EXPENSE_TRACKER.ADD.Component,
			props: {
				type: MODAL_CONFIG.EXPENSE_TRACKER.ADD.type,
				data: { usage_date: selected.toISOString() },
			},
		});
	};

	return (
		<section>
			<Header>
				<Title>Expense Tracker</Title>
				<AddPaymentButton type="button" onClick={handleAddPaymentModal}>
					NEW
				</AddPaymentButton>
			</Header>
			<DatePicker selected={selected} setSelected={setSelected} disabled={{ after: today }} isFloated={true} />
			<PaymentListLayout>
				<PaymentListTitle>List</PaymentListTitle>
				<Flex>
					<SegmentedControl options={segmentedControlOptions} current={currentPaymentMethod} setCurrent={setCurrentPaymentMethod} />
					<Select
						data={priceUnit.unitType}
						currentValue={currentPriceUnit}
						placeholder={'Select Price Unit'}
						descriptionLabel={priceUnit.unitSymbol.join(' ')}
						onSelect={option => setCurrentPriceUnit(option)}
					/>
				</Flex>
				<Suspense fallback={<PaymentItemLoader />}>
					<PaymentList selectedDate={selected} currentPaymentMethod={currentPaymentMethod} currentPriceUnit={currentPriceUnit} />
				</Suspense>
			</PaymentListLayout>
		</section>
	);
};

const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16px;
`;

const Title = styled.h2`
	font-size: var(--fz-h5);
	font-weight: var(--fw-bold);
`;

const AddPaymentButton = styled.button`
	padding: calc(var(--padding-container-mobile) * 0.5) var(--padding-container-mobile);
	min-height: 40px;
	color: var(--white);
	background-color: var(--blue200);
	font-size: var(--fz-p);
	font-weight: var(--fw-bold);
	border-radius: var(--radius-s);
	transition: opacity 0.15 ease-in-out;

	&:hover,
	&:focus {
		opacity: 0.95;
	}
`;

const PaymentListLayout = styled.div`
	margin: 32px 0 48px;
`;

const PaymentListTitle = styled.div`
	margin-bottom: 8px;
	font-size: var(--fz-h7);
	font-weight: var(--fw-semibold);
`;

const Flex = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 4px;
`;

export default ExpenseTrackerByMonthPage;
