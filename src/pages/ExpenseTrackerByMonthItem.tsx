import styled from '@emotion/styled';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { FaWonSign } from 'react-icons/fa6';
import { BsFillCreditCardFill } from 'react-icons/bs';
import { Button, Switch } from '../components';
import { useLoading } from '../hooks';
import { removePayment } from '../supabase';
import { monetizeWithSeparator, format, getNormalizedDateString } from '../utils';
import { useToastStore } from '../store';
import { routes, queryKey, toastData } from '../constants';

const ExpenseTrackerByMonthItemPage = () => {
	const queryClient = useQueryClient();
	const {
		state: { payment, currentDate },
	} = useLocation();

	const { startTransition, Loading, isLoading } = useLoading();
	const { addToast } = useToastStore();
	const navigate = useNavigate();

	const handlePaymentDelete = async () => {
		try {
			await startTransition(removePayment({ id: payment.id }));

			addToast(toastData.EXPENSE_TRACKER.REMOVE.SUCCESS);
			navigate(routes.EXPENSE_TRACKER_BY_MONTH, { state: { currentDate }, replace: true });
		} catch (e) {
			console.error(e);
			addToast(toastData.EXPENSE_TRACKER.REMOVE.ERROR);
		} finally {
			queryClient.invalidateQueries({ queryKey: [...queryKey.EXPENSE_TRACKER, getNormalizedDateString(currentDate)] });
		}
	};

	// TODO: edit Switch to toggle Upcoming Next Month with `payment.isFixed`
	return (
		<Container>
			<MainContent>
				<PaymentMethod>
					<WonIconWrapper>
						{payment.payment_method === 'Card' ? <BsFillCreditCardFill size="14" /> : <FaWonSign size="14" />}
					</WonIconWrapper>
					<span>{payment.payment_method}</span>
				</PaymentMethod>
				<Price>
					<span>
						{monetizeWithSeparator(payment.priceIntegerPart)}
						{payment.priceDecimalPart.length ? `.${payment.priceDecimalPart}` : ''}
					</span>
					<span>{payment.price_unit}</span>
				</Price>
			</MainContent>

			<Detail>
				<DetailGroup>
					<dt>Place</dt>
					<dd>{payment.place}</dd>
				</DetailGroup>
				<DetailGroup>
					<dt>Bank</dt>
					<dd>{payment.bank}</dd>
				</DetailGroup>
				<DetailGroup>
					<dt>Transaction Date</dt>
					<dd>{format(currentDate)}</dd>
				</DetailGroup>
				<DetailGroup>
					<dt>Make Upcoming Next Month</dt>
					<dd>
						<Switch initialValue={payment.isFixed} />
					</dd>
				</DetailGroup>
			</Detail>

			<DeleteButton type="button" onClick={handlePaymentDelete}>
				{isLoading ? Loading : 'Delete'}
			</DeleteButton>
		</Container>
	);
};

const Container = styled.section`
	position: relative;
	display: flex;
	flex-direction: column;
	height: calc(100dvh - 3 * var(--nav-height));
`;

const MainContent = styled.div``;

const PaymentMethod = styled.div`
	display: flex;
	align-items: center;
	gap: 6px;
	margin-top: 32px;

	span {
		font-weight: var(--fw-semibold);
	}
`;

const WonIconWrapper = styled.div`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	padding: calc(var(--padding-container-mobile) * 0.35);
	color: var(--white);
	background-color: var(--grey800);
	border-radius: var(--radius-m);
`;

const Price = styled.div`
	display: flex;
	align-items: center;
	gap: 6px;
	font-size: var(--fz-h4);
	font-weight: var(--fw-bold);
`;

const Detail = styled.dl`
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: calc(var(--padding-container-mobile) * 3) 0;
`;

const DetailGroup = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;

	dt {
		font-weight: var(--fw-medium);
		color: var(--grey800);
	}

	dd {
		font-size: var(--fz-h7);
		font-weight: var(--fw-semibold);
	}
`;

const DeleteButton = styled(Button)`
	position: absolute;
	bottom: 0;
	padding: var(--padding-container-mobile);
	width: 100%;
	font-size: var(--fz-p);
	font-weight: var(--fw-semibold);
	color: var(--white);
	background-color: var(--black);

	&:focus {
		background-color: var(--grey900);
	}
`;

export default ExpenseTrackerByMonthItemPage;
