import { FaWonSign } from 'react-icons/fa6';
import styled from '@emotion/styled';

const PaymentItem = () => {
	return (
		<Container
			onBlur={e => {
				e.target.blur();
			}}>
			<WonIconWrapper>
				<FaWonSign size="18" />
			</WonIconWrapper>
			<PaymentInfo>
				<Main>
					<div>
						<dt>금 액</dt>
						<dd>30,000</dd>
					</div>
					<div>
						<dt>은 행</dt>
						<dd>신한은행</dd>
					</div>
				</Main>
				<Sub>
					<div>
						<dt>사용처</dt>
						<dd>런던아이</dd>
					</div>
				</Sub>
			</PaymentInfo>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	align-items: center;
	gap: 36px;
	padding: var(--padding-container-mobile) calc(var(--padding-container-mobile) * 0.5);
	width: 100%;
	border-radius: var(--radius-m);
	cursor: pointer;
	transition: background 0.15s ease-in-out;

	&:hover,
	&:focus {
		background-color: var(--grey50);
	}
`;

const WonIconWrapper = styled.div`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	padding: 8px;
	color: var(--white);
	background-color: var(--blue200);
	border-radius: var(--radius-m);
`;

const PaymentInfo = styled.dl`
	display: flex;
	flex-direction: column;
	width: 100%;
`;

const Main = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16px;
	width: 100%;

	div {
		display: flex;
		align-items: center;
		gap: 6px;

		dt {
			font-size: var(--fz-sm);
			font-weight: var(--fw-medium);
			color: var(--grey500);
		}

		dd {
			font-size: var(--fz-p);
			font-weight: var(--fw-bold);
		}
	}
`;

const Sub = styled.div`
	display: flex;

	div {
		display: flex;
		align-items: center;
		gap: 6px;

		dt {
			font-size: var(--fz-sm);
			font-weight: var(--fw-medium);
			color: var(--grey500);
		}

		dd {
			font-size: var(--fz-p);
			font-weight: var(--fw-bold);
			color: var(--grey600);
		}
	}
`;

export default PaymentItem;
