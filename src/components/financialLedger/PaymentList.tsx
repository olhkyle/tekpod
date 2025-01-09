import { useSuspenseQuery } from '@tanstack/react-query';
import styled from '@emotion/styled';
import queryKey from '../../constants/queryKey';
import { getPaymentsByDate } from '../../supabase/financialLedger';
import PaymentItem from './PaymentItem';
import { monetizeWithSeparator } from '../../utils/money';
import { EmptyMessage, SegmentedControl, Select } from '../common';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PaymentListProps {
	selectedDate: Date;
}

const segmentedControlOptions = ['All', 'Card', 'Cash'] as const;

const PaymentList = ({ selectedDate }: PaymentListProps) => {
	const {
		data: { data, totalPrice },
	} = useSuspenseQuery({
		queryKey: [...queryKey.FINANCIAL_LEDGER, selectedDate],
		queryFn: () => getPaymentsByDate(selectedDate),
	});

	const navigate = useNavigate();

	const [currentPaymentMethod, setCurrentPaymentMethod] = useState<string>(segmentedControlOptions[0]);
	const [currentPriceUnit, setCurrentPriceUnit] = useState<string>('WON');

	// TODO: - Pagination 구현

	return (
		<Container>
			<Flex>
				<SegmentedControl options={segmentedControlOptions} current={currentPaymentMethod} setCurrent={setCurrentPaymentMethod} />
				<Select
					data={['WON', 'USD', 'GBP', 'EUR', 'JPY']}
					currentValue={currentPriceUnit}
					placeholder={'Select Price Unit'}
					onSelect={option => setCurrentPriceUnit(option)}
				/>
			</Flex>

			{totalPrice !== 0 && (
				<TotalPrice>
					{Object.entries(totalPrice).map(([priceUnit, price], idx) => (
						<div key={`payment_${idx}`} css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
							<dt>{priceUnit}</dt>
							<dd>{monetizeWithSeparator(price.toString())}</dd>
						</div>
					))}
				</TotalPrice>
			)}

			{data?.length === 0 ? (
				<EmptyMessage emoji={'💳'}>사용한 금액이 없습니다</EmptyMessage>
			) : (
				<PaymentListContent>
					{(currentPaymentMethod === segmentedControlOptions[0]
						? data
						: data.filter(({ payment_method }) => payment_method === currentPaymentMethod)
					)
						.filter(({ price_unit }) => price_unit === currentPriceUnit)
						.map((payment, idx) => (
							<li
								key={`${payment.place}_${payment.bank}_${idx}`}
								onClick={() => navigate(`${payment.id}`, { state: { payment, currentDate: selectedDate } })}>
								<PaymentItem data={payment} />
							</li>
						))}
				</PaymentListContent>
			)}
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	flex-direction: column;
	margin: 0 0 16px 0;
`;

const Flex = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 4px;
	margin-top: 8px;
`;

const TotalPrice = styled.dl`
	position: fixed;
	bottom: calc(var(--nav-height) + 32px);
	right: 16px;
	display: inline-flex;
	flex-direction: column;
	gap: 8px;
	padding: calc(var(--padding-container-mobile) * 0.5);
	min-width: 90px;
	background-color: var(--black);
	border: 1px solid var(--grey300);
	border-radius: var(--radius-s);

	dt {
		font-weight: var(--fw-medium);
		color: var(--white);
	}

	dd {
		font-size: var(--fz-h7);
		font-weight: var(--fw-bold);
		color: var(--white);
	}
`;

const PaymentListContent = styled.ul`
	margin-top: 16px;
`;

export default PaymentList;
