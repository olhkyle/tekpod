import { useState } from 'react';
import styled from '@emotion/styled';

interface SwitchProps {
	initialValue: boolean;
}

const Switch = ({ initialValue }: SwitchProps) => {
	const [isToggle, setIsToggle] = useState(initialValue);

	return (
		<Container
			onClick={() => {
				setIsToggle(!isToggle);
			}}>
			<Trigger isToggle={isToggle} />
			<Background isToggle={isToggle} />
		</Container>
	);
};

const Container = styled.div`
	position: relative;
	width: 48px;
	height: 26px;
	cursor: pointer;
`;

const Trigger = styled.button<{ isToggle: boolean }>`
	position: absolute;
	top: 3px;
	left: ${({ isToggle }) => (isToggle ? '26px' : '2px')};
	width: 20px;
	height: 20px;
	background-color: var(--white);
	border: 1px solid var(--grey300);
	border-radius: var(--radius-extra);
	transition: left calc(0.2 * 1s);
`;

const Background = styled.div<{ isToggle: boolean }>`
	display: flex;
	height: 100%;
	background-color: ${({ isToggle }) => (isToggle ? 'var(--black)' : 'var(--grey300)')};
	border-radius: var(--radius-extra);
	box-shadow: 2px 2px 5px 0 rgba(50, 50, 50, 0.25);
	transition: background calc(0.2 * 1s);
`;

export default Switch;
