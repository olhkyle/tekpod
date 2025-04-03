import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import { EmptyMessage } from '../common';
import { ExpenseTracker, FIXED_PAYMENT_DATE, getCreditCardPaymentsByMonth } from '../../supabase';
import { bankSvgs, queryKey } from '../../constants';
import { formatByKoreanTime, getCompletedMonth, monetizeWithSeparator } from '../../utils';

const CreditCardTransactionList = () => {
	const { data } = useSuspenseQuery<ExpenseTracker[]>({
		queryKey: [...queryKey.EXPENSE_TRACKER, 'creditCard'],
		queryFn: getCreditCardPaymentsByMonth,
	});

	const dataWithCompletedMonth = data.map(payment => {
		const _date = new Date(formatByKoreanTime(payment.usage_date));
		const [usage_month, usage_date] = [_date.getMonth(), _date.getDate()];

		return { ...payment, completedMonth: getCompletedMonth({ payment, usage_month, usage_date, FIXED_PAYMENT_DATE }) };
	});

	return (
		<>
			{dataWithCompletedMonth.length === 0 ? (
				<EmptyMessage emoji="💵">No Scheduled Costs</EmptyMessage>
			) : (
				<TransactionList>
					{dataWithCompletedMonth.map(payment => (
						<Transaction key={payment.id}>
							<Info>
								<UsageDate>{formatByKoreanTime(payment.usage_date)}</UsageDate>
								<PlaceAndPrice>
									<div aria-label="place">{payment.place}</div>
									<div aria-label="price">
										{monetizeWithSeparator(payment.price)} {payment.price_unit}
									</div>
								</PlaceAndPrice>

								<CompletedMonthInfo>
									<span>complete payment on </span>
									<CompletedMonth>{payment.completedMonth}</CompletedMonth>
								</CompletedMonthInfo>
							</Info>
							<Content>
								<InstallmentPlan>
									{payment.installment_plan_months === 0 ? 'One-time payment' : `${payment.installment_plan_months} month`}
								</InstallmentPlan>
								{bankSvgs[payment.bank] ? (
									<BankImage>
										<img src={bankSvgs[payment.bank]} alt={payment.bank} />
									</BankImage>
								) : (
									<BankText>{payment.bank}</BankText>
								)}
							</Content>
						</Transaction>
					))}
				</TransactionList>
			)}
		</>
	);
};

const TransactionList = styled.ul`
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-top: 8px;
`;

const Transaction = styled.li`
	display: flex;
	justify-content: space-between;
	padding: var(--padding-container-mobile) calc(var(--padding-container-mobile));
	background-color: var(--white);
	border: 1px solid var(--blue100);
	border-radius: var(--radius-l);
`;

const Info = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 8px;
`;

const UsageDate = styled.div`
	display: inline-flex;
	align-items: center;
	font-size: var(--fz-sm);
	font-weight: var(--fw-medium);
	color: var(--grey700);
	border-radius: var(--radius-l);
`;

const PlaceAndPrice = styled.div`
	div[aria-label='place'] {
		font-weight: var(--fw-medium);
		color: var(--grey600);
	}

	div[aria-label='price'] {
		font-size: var(--fz-h7);
		font-weight: var(--fw-semibold);
		color: var(--black);
	}
`;

const CompletedMonthInfo = styled.div`
	display: inline-flex;
	align-items: center;
	gap: 4px;
	padding: calc(var(--padding-container-mobile) * 0.25);
	background-color: var(--grey50);
	border-radius: var(--radius-s);
	font-size: var(--fz-sm);
`;

const CompletedMonth = styled.span`
	display: inline-block;
	padding: calc(var(--padding-container-mobile) * 0.25);
	font-weight: var(--fw-medium);
	color: var(--grey800);
	background-color: var(--grey200);
	border-radius: var(--radius-xs);
`;

const Content = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: flex-end;
`;

const InstallmentPlan = styled.span`
	display: inline-block;
	padding: calc(var(--padding-container-mobile) * 0.25);
	font-size: var(--fz-sm);
	font-weight: var(--fw-medium);
	color: var(--blue200);
	background-color: var(--blue100);
	border-radius: var(--radius-s);
`;

const BankImage = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 48px;
	height: 48px;

	img {
		display: block;
		width: 100%;
		height: 100%;
	}
`;

const BankText = styled.span`
	padding: calc(var(--padding-container-mobile) * 0.5) var(--padding-container-mobile);
	color: var(--grey700);
	background-color: var(--grey100);
	font-weight: var(--fw-medium);
	border-radius: var(--radius-s);
`;

export default CreditCardTransactionList;
