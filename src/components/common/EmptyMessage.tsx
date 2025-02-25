import { ReactNode } from 'react';
import styled from '@emotion/styled';

interface EmptyMessageProps {
	emoji?: string;
	children: ReactNode;
}

const EmptyMessage = ({ emoji, children }: EmptyMessageProps) => {
	return (
		<Container>
			<Emoji>{emoji}</Emoji>
			{children}
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
	margin-top: 16px;
	padding: calc(var(--padding-container-mobile) * 3) var(--padding-container-mobile);
	font-size: var(--fz-h7);
	font-weight: var(--fw-bold);
	border: 1px solid var(--greyOpacity200);
	border-radius: var(--radius-s);
	background-color: var(--greyOpacity50);
	color: var(--grey700);
`;

const Emoji = styled.span`
	font-size: calc(var(--fz-h1) * 1.5);
`;

export default EmptyMessage;
