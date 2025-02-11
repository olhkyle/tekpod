import { Suspense, useState } from 'react';
import styled from '@emotion/styled';
import { DatePicker, PaymentItemLoader, PaymentList, SegmentedControl, Select } from '../components';
import useModalStore from '../store/useModalStore';
import { useLocation } from 'react-router-dom';
import { MODAL_CONFIG } from '../components/modal/modalType';
import { priceUnit, PriceUnitType } from '../constants/expenseTracker';

export type ExtendedPaymentMethodType = (typeof segmentedControlOptions)[number];
const segmentedControlOptions = ['All', 'Card', 'Cash'] as const;

const ExpenseTrackerByMonthPage = () => {
	const { state } = useLocation();
	const [selected, setSelected] = useState<Date>(state?.currentDate ?? new Date());
	const { setModal } = useModalStore();

	const [currentPaymentMethod, setCurrentPaymentMethod] = useState<ExtendedPaymentMethodType>(segmentedControlOptions[0]);
	const [currentPriceUnit, setCurrentPriceUnit] = useState<PriceUnitType>('WON');

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
			<Header>
				<Title>가계부</Title>
				<AddPaymentButton type="button" onClick={handleAddPaymentModal}>
					추가하기
				</AddPaymentButton>
			</Header>
			<DatePicker selected={selected} setSelected={setSelected} />
			<PaymentListLayout>
				<PaymentListTitle>사용내역</PaymentListTitle>
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
	margin-top: 32px;
`;

const PaymentListTitle = styled.div`
	font-size: var(--fz-h7);
	font-weight: var(--fw-semibold);
`;

const Flex = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 4px;
	margin-top: 8px;
`;

export default ExpenseTrackerByMonthPage;
