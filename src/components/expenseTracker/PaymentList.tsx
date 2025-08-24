import { useNavigate } from 'react-router-dom';
import { useSuspenseQuery } from '@tanstack/react-query';
import styled from '@emotion/styled';
import { EmptyMessage, PaymentItem } from '..';
import { ExtendedPaymentMethodType } from '../../pages/ExpenseTrackerByMonth';
import { getPaymentsByDate } from '../../supabase';
import { formatByISOKoreanTime, monetizeWithSeparator } from '../../utils';
import { PriceUnitType, staleTime, queryKey } from '../../constants';

interface PaymentListProps {
	selectedDate: Date;
	currentPaymentMethod: ExtendedPaymentMethodType;
	currentPriceUnit: PriceUnitType;
}

/**
 * TODO:
 * - 1 : use pagination
 */

const PaymentList = ({ selectedDate, currentPaymentMethod, currentPriceUnit }: PaymentListProps) => {
	const {
		data: { expense, totalPrice },
	} = useSuspenseQuery({
		queryKey: [...queryKey.EXPENSE_TRACKER, formatByISOKoreanTime(selectedDate)],
		queryFn: () => getPaymentsByDate(selectedDate),
		staleTime: staleTime.EXPENSE_TRACKER.BY_MONTH,
	});

	const navigate = useNavigate();

	const filteredData = expense?.filter(
		({ payment_method, price_unit }) =>
			(currentPaymentMethod === 'All' || payment_method === currentPaymentMethod) && price_unit === currentPriceUnit,
	);

	return (
		<Container>
			{totalPrice !== 0 && (
				<TotalPriceSummary>
					{Object.entries(totalPrice).map(([priceUnit, price], idx) => (
						<TotalPriceContent key={`payment_${idx}`}>
							<dt>{priceUnit}</dt>
							<dd>{monetizeWithSeparator(price)}</dd>
						</TotalPriceContent>
					))}
				</TotalPriceSummary>
			)}

			{totalPrice === 0 || filteredData.length === 0 ? (
				<EmptyMessage emoji={'💳'}>{`No ${currentPaymentMethod === 'All' ? '' : currentPaymentMethod} Expenses Recorded`}</EmptyMessage>
			) : (
				<PaymentListContent>
					{filteredData.map((payment, idx) => (
						<li
							key={`${payment.place}_${payment.bank}_${idx}`}
							onClick={() =>
								navigate(`${payment.id}?date=${formatByISOKoreanTime(selectedDate)}`, { state: { payment, currentDate: selectedDate } })
							}>
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
`;

const TotalPriceSummary = styled.dl`
	display: inline-flex;
	flex-direction: column;
	gap: 8px;
	margin: 16px calc(var(--padding-container-mobile) * 0.35) 0;
	padding: calc(var(--padding-container-mobile) * 0.5);
	min-width: 90px;
	color: var(--blue200);
	background-color: var(--blue100);
	border-radius: var(--radius-s);
	z-index: var(--hovered-info-index);
`;

const TotalPriceContent = styled.div`
	display: inline-flex;
	justify-content: space-between;
	align-items: center;
	gap: 8px;

	dt {
		font-weight: var(--fw-medium);
	}

	dd {
		font-size: var(--fz-h7);
		font-weight: var(--fw-bold);
	}
`;

const PaymentListContent = styled.ul`
	margin-top: 16px;
`;

export default PaymentList;
