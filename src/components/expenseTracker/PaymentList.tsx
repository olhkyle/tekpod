import { useNavigate } from 'react-router-dom';
import { useSuspenseQuery } from '@tanstack/react-query';
import styled from '@emotion/styled';
import { EmptyMessage, PaymentItem } from '..';
import { ExtendedPaymentMethodType } from '../../pages/ExpenseTrackerByMonth';
import { getPaymentsByDate } from '../../supabase';
import { formatByKoreanTime, monetizeWithSeparator } from '../../utils';
import { PriceUnitType, staleTime, queryKey } from '../../constants';

interface PaymentListProps {
	selectedDate: Date;
	currentPaymentMethod: ExtendedPaymentMethodType;
	currentPriceUnit: PriceUnitType;
}

const PaymentList = ({ selectedDate, currentPaymentMethod, currentPriceUnit }: PaymentListProps) => {
	const {
		data: { expense, totalPrice },
	} = useSuspenseQuery({
		queryKey: [...queryKey.EXPENSE_TRACKER, formatByKoreanTime(selectedDate)],
		queryFn: () => getPaymentsByDate(selectedDate),
		staleTime: staleTime.EXPENSE_TRACKER.BY_MONTH,
	});

	const navigate = useNavigate();

	const filteredData = expense?.filter(
		({ payment_method, price_unit }) =>
			(currentPaymentMethod === 'All' || payment_method === currentPaymentMethod) && price_unit === currentPriceUnit,
	);

	// TODO: - Pagination 구현

	return (
		<Container>
			{totalPrice !== 0 && (
				<TotalPrice>
					{Object.entries(totalPrice).map(([priceUnit, price], idx) => (
						<div key={`payment_${idx}`} css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
							<dt>{priceUnit}</dt>
							<dd>{monetizeWithSeparator(price)}</dd>
						</div>
					))}
				</TotalPrice>
			)}

			{filteredData?.length === 0 ? (
				<EmptyMessage emoji={'💳'}>
					{currentPaymentMethod === 'All' ? '사용한 금액이 없습니다' : `${currentPaymentMethod}로 사용한 금액이 없습니다`}
				</EmptyMessage>
			) : (
				<PaymentListContent>
					{filteredData.map((payment, idx) => (
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
