import { useSuspenseQuery } from '@tanstack/react-query';
import styled from '@emotion/styled';
import queryKey from '../../constants/queryKey';
import { getPaymentsByDate } from '../../supabase/financialLedger';
import PaymentItem from './PaymentItem';
import { monetizeWithWon } from '../../utils/money';
import { EmptyMessage, SegmentedControl } from '../common';
import { useState } from 'react';

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

	const [current, setCurrent] = useState<string>(segmentedControlOptions[0]);

	// TODO: SegmentedControl <Card | Cash>
	// - Pagination 구현
	// TODO: CustomSelect 파운드, 달러 일 때 환산해서 보기

	return (
		<Container>
			<Flex>
				<SegmentedControl options={segmentedControlOptions} current={current} setCurrent={setCurrent} />
				<TotalPrice>
					<dt>총 사용금액</dt>
					<dd>{monetizeWithWon(totalPrice.toString())}</dd>
				</TotalPrice>
			</Flex>

			{data?.length === 0 ? (
				<EmptyMessage emoji={'💳'}>사용한 금액이 없습니다</EmptyMessage>
			) : (
				<PaymentListContent>
					{(current === segmentedControlOptions[0] ? data : data.filter(item => item.payment_method === current)).map((payment, idx) => (
						<li key={`${payment.place}_${payment.bank}_${idx}`}>
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
	margin-top: 8px;
`;

const TotalPrice = styled.dl`
	display: inline-flex;
	justify-content: flex-end;
	align-items: center;
	gap: 8px;
	padding: calc(var(--padding-container-mobile) * 0.5);

	background-color: var(--grey100);
	border: 1px solid var(--grey300);
	border-radius: var(--radius-s);

	dt {
		font-weight: var(--fw-medium);
		color: var(--grey700);
	}

	dd {
		font-size: var(--fz-h7);
		font-weight: var(--fw-bold);
		color: var(--grey800);
	}
`;

const PaymentListContent = styled.ul`
	margin-top: 16px;
`;

export default PaymentList;
