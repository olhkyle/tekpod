import { useState } from 'react';
import styled from '@emotion/styled';
import { ko } from 'date-fns/locale';
import { IoMdCalendar } from 'react-icons/io';
import { DayPicker } from 'react-day-picker';
import { format } from '../utils/date';
import { Button, PaymentItem } from '../components';
import { customPropReceiver } from '../constants';

/**
 * Tour_Payment
 *
 * {
 *  id: string;
 * bank: '신한' | '국민' | '하나' | 'IBK기업' | '우리'
 * price: number;
 * place: string;
 * created_at: Date;
 * updated_at: Date;
 * }
 *
 */

const FinancialLedgerPage = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [selected, setSelected] = useState<Date | undefined>(new Date());

	return (
		<section>
			<Header>
				<Title>여행 가계부</Title>
				<AddPaymentButton type="button">추가하기</AddPaymentButton>
			</Header>
			<DatePicker>
				<TriggerButton type="button" $isDaySelected={selected ? true : false} onClick={() => setIsOpen(!isOpen)}>
					<IconBackground>
						<IoMdCalendar size="24" color="var(--blue200)" />
					</IconBackground>
					{selected ? format(selected) : '날짜를 선택해 주세요'}
				</TriggerButton>
				{isOpen && (
					<DayPicker
						mode="single"
						locale={ko}
						selected={selected}
						onSelect={setSelected}
						captionLayout="dropdown"
						timeZone="Asia/Seoul"
						showOutsideDays
						onDayClick={() => {
							setIsOpen(false);
						}}
					/>
				)}
			</DatePicker>
			<PaymentList>
				<PaymentListTitle>사용내역</PaymentListTitle>
				{Array.from({ length: 3 }, (_, idx) => (
					<PaymentItem key={idx} />
				))}
			</PaymentList>
		</section>
	);
};

const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const Title = styled.h2`
	font-size: var(--fz-h6);
	font-weight: var(--fw-bold);
`;

const AddPaymentButton = styled.button`
	padding: calc(var(--padding-container-mobile) * 0.5) var(--padding-container-mobile);
	min-height: 40px;
	color: var(--white);
	background-color: var(--blue200);
	font-weight: var(--fw-bold);
	border-radius: var(--radius-s);
	transition: opacity 0.15 ease-in-out;

	&:hover,
	&:focus {
		opacity: 0.95;
	}
`;

const DatePicker = styled.div`
	position: relative;
	display: inline-flex;
	flex-direction: column;
	gap: 4px;
	margin-top: 8px;
`;

const TriggerButton = styled(Button, customPropReceiver)<{ $isDaySelected: boolean }>`
	display: inline-flex;
	justify-content: space-between;
	align-items: center;
	gap: 6px;
	padding: calc(var(--padding-container-mobile) * 0.5) var(--padding-container-mobile);
	color: ${({ $isDaySelected }) => ($isDaySelected ? 'var(--grey900)' : 'var(--grey500)')};
	background-color: var(--greyOpacity50);
	border: 1px solid var(--grey100);
	border-radius: var(--radius-m);
	font-size: var(--fz-p);
	font-weight: var(--fw-semibold);
`;

const IconBackground = styled.div`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	padding: 4px;
	background-color: var(--blue100);
	border-radius: var(--radius-m);
`;

const PaymentList = styled.div`
	margin-top: 32px;
`;

const PaymentListTitle = styled.div`
	font-size: var(--fz-p);
	font-weight: var(--fw-semibold);
`;

export default FinancialLedgerPage;
