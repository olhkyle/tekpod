import { Suspense } from 'react';
import styled from '@emotion/styled';
import { CreditCardTransactionList, CreditCardTransactionListLoader, Description } from '../components';

const ExpenseTrackerCreditCardTransaction = () => {
	return (
		<section>
			<Title>Scheduled Charge</Title>
			<Description>This page will show all scheduled credit card transaction based on current month</Description>
			<Suspense fallback={<CreditCardTransactionListLoader />}>
				<CreditCardTransactionList />
			</Suspense>
		</section>
	);
};

const Title = styled.h2`
	margin-bottom: 16px;
	font-size: var(--fz-h5);
	font-weight: var(--fw-black);
	color: var(--grey900);
`;

export default ExpenseTrackerCreditCardTransaction;
