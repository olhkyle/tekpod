import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getFixedCostPaymentsByMonth } from '../supabase';
import { queryKey, bankSvgs, routes } from '../constants';
import { getDateFromString, getNextMonthFormatDate, months, today, monetizeWithSeparator } from '../utils';

/**
 * 고정 지출 내역
 * icloud - 3,300 (21일)
 *
 * id
 * user_id
 * title
 * price
 * card
 * paymentDate
 * description
 *
 */

const ExpenseTrackerFixedCost = () => {
	const { data } = useSuspenseQuery({
		queryKey: [...queryKey.EXPENSE_TRACKER, 'fixedCost'],
		queryFn: () => getFixedCostPaymentsByMonth(today.getMonth() - 1),
	});

	const navigate = useNavigate();

	return (
		<section>
			<Title>
				<TotalPrice>
					<span aria-label="total price to pay">Total Price to pay</span>
					<p aria-label="total price">{monetizeWithSeparator(data.reduce((acc, curr) => acc + +curr.priceIntegerPart, 0) + '')}</p>
				</TotalPrice>
				<CurrentMonth>{months[today.getMonth()]}</CurrentMonth>
			</Title>

			<Description>Expected upcoming costs based on last month</Description>
			<Payments>
				{data.map(payment => (
					<Payment
						key={payment.id}
						onClick={() =>
							navigate(`${routes.EXPENSE_TRACKER}/daily/${payment.id}`, { state: { payment, currentDate: payment.usage_date } })
						}>
						<Date>
							<Passed isPassed={getDateFromString(payment.usage_date).getDate() < today.getDate()} />
							<div aria-label="usage_date">{getNextMonthFormatDate(payment.usage_date)}</div>
						</Date>
						<Detail>
							<PlaceAndPrice>
								<div aria-label="place">{payment.place}</div>
								<div aria-label="price">
									{monetizeWithSeparator(payment.priceIntegerPart)}
									{payment.priceDecimalPart && '.'}
									{payment.priceDecimalPart} {payment.price_unit}
								</div>
							</PlaceAndPrice>
							{bankSvgs[payment.bank] ? (
								<BankImage>
									<img src={bankSvgs[payment.bank]} alt={payment.bank} />{' '}
								</BankImage>
							) : (
								<BankText>{payment.bank}</BankText>
							)}
						</Detail>
					</Payment>
				))}
			</Payments>
		</section>
	);
};

const Title = styled.h2`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16px;
	font-size: var(--fz-h5);
	font-weight: var(--fw-black);
	color: var(--grey900);
`;

const CurrentMonth = styled.span`
	padding: calc(var(--padding-container-mobile) * 0.25) calc(var(--padding-container-mobile) * 0.5);
	color: var(--white);
	background-color: var(--black);
	font-size: var(--fz-h6);
	border-radius: var(--radius-s);
`;

const TotalPrice = styled.div`
	display: flex;
	flex-direction: column;
	padding: calc(var(--padding-container-mobile) * 0.25) calc(var(--padding-container-mobile) * 0.75);
	background-color: var(--grey50);
	border-radius: var(--radius-s);

	span {
		font-size: var(--fz-p);
		font-weight: var(--fw-medium);
		color: var(--grey600);
	}

	p {
		font-size: var(--fz-h5);
		font-weight: var(--fw-bold);
	}
	/* background-color: var(-); */
`;

const Description = styled.p`
	padding: calc(var(--padding-container-mobile) * 0.5) calc(var(--padding-container-mobile) * 0.75);
	font-weight: var(--fw-medium);
	color: var(--blue200);
	background-color: var(--blue100);
	border-radius: var(--radius-s);
`;

const Payments = styled.ul`
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-top: 8px;
`;

const Payment = styled.li`
	position: relative;
	padding: var(--padding-container-mobile) calc(var(--padding-container-mobile));
	background-color: var(--grey50);
	border-radius: var(--radius-l);
	transition: background 0.15s ease-in-out;
	cursor: pointer;

	&:hover {
		background-color: var(--blue100);
	}
`;

const Date = styled.div`
	display: inline-flex;
	align-items: center;
	gap: 12px;
	padding: 0 calc(var(--padding-container-mobile) * 0.5);
	font-size: var(--fz-p);
	font-weight: var(--fw-medium);
	background-color: var(--blue100);
	border-radius: var(--radius-l);
`;

const Passed = styled.span<{ isPassed: boolean }>`
	display: inline-block;
	width: 10px;
	height: 10px;
	border-radius: var(--radius-extra);
	background-color: ${({ isPassed }) => (isPassed ? 'var(--grey200)' : 'var(--blue200)')};
`;

const Detail = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 8px;
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
	background-color: var(--grey200);
	font-weight: var(--fw-medium);
	border-radius: var(--radius-s);
`;

export default ExpenseTrackerFixedCost;
