import { useState } from 'react';
import styled from '@emotion/styled';
import { AddPaymentModal, DatePicker, PaymentItem } from '../components';
import useModalStore from '../store/useModalStore';

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
	const [selected, setSelected] = useState<Date | undefined>(new Date());
	const { setModal } = useModalStore();

	const handleAddPaymentModal = () => {
		setModal({
			Component: AddPaymentModal,
			props: {
				type: 'financialLedger',
				data: null,
			},
		});
	};

	return (
		<section>
			<Header>
				<Title>여행 가계부</Title>
				<AddPaymentButton type="button" onClick={handleAddPaymentModal}>
					추가하기
				</AddPaymentButton>
			</Header>
			<DatePicker selected={selected} setSelected={setSelected} />
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

const PaymentList = styled.div`
	margin-top: 32px;
`;

const PaymentListTitle = styled.div`
	font-size: var(--fz-p);
	font-weight: var(--fw-semibold);
`;

export default FinancialLedgerPage;
