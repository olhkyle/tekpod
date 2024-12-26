import { useSuspenseQuery } from '@tanstack/react-query';
import styled from '@emotion/styled';
import queryKey from '../../constants/queryKey';
import { getPaymentsByDate } from '../../supabase/financialLedger';
import PaymentItem from './PaymentItem';
import { monetizeWithWon } from '../../utils/money';

interface PaymentListProps {
	selectedDate: Date;
}

const PaymentList = ({ selectedDate }: PaymentListProps) => {
	const {
		data: { data, totalPrice },
	} = useSuspenseQuery({
		queryKey: [...queryKey.FINANCIAL_LEDGER, selectedDate],
		queryFn: () => getPaymentsByDate(selectedDate),
	});

	// TODO: SegmentedControl <Card | Cash>
	// TODO: CustomSelect 파운드, 달러 일 때 환산해서 보기

	return (
		<Container>
			<Flex>
				<TotalPrice>
					<dt>총 사용금액</dt>
					<dd>{monetizeWithWon(totalPrice.toString())}</dd>
				</TotalPrice>
			</Flex>

			<ul>
				{data.map((payment, idx) => (
					<li key={`${payment.place}_${payment.bank}_${idx}`}>
						<PaymentItem data={payment} />
					</li>
				))}
			</ul>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	flex-direction: column;
	margin: 16px 0;
`;

const Flex = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const TotalPrice = styled.dl`
	display: inline-flex;
	justify-content: flex-end;
	gap: 8px;
	padding: calc(var(--padding-container-mobile) * 0.5);
	color: var(--blue200);
	background-color: var(--blue100);

	border: 1px solid var(--blue300);
	border-radius: var(--radius-s);

	dt {
		margin-left: auto;
	}

	dd {
		font-size: var(--fz-p);
		font-weight: var(--fw-semibold);
	}
`;

export default PaymentList;
