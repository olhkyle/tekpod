import { useState } from 'react';
import styled from '@emotion/styled';
import { debounce } from 'es-toolkit';

interface SwitchProps {
	initialValue: boolean;
	toggle: (newState: boolean) => void;
}

const Switch = ({ initialValue, toggle }: SwitchProps) => {
	const [isActive, setIsActive] = useState(initialValue);

	const handleSwitchToggle = (newState: boolean) => {
		setIsActive(newState);

		const debouncedServerUpdate = debounce(isActive => toggle(isActive), 200);

		debouncedServerUpdate(newState);
	};

	return (
		<Container onClick={() => handleSwitchToggle(!isActive)}>
			<Trigger isActive={isActive} />
			<Background isActive={isActive} />
		</Container>
	);
};

const Container = styled.div`
	position: relative;
	width: 48px;
	height: 26px;
	cursor: pointer;
`;

const Trigger = styled.button<{ isActive: boolean }>`
	position: absolute;
	top: 3px;
	left: ${({ isActive }) => (isActive ? '26px' : '2px')};
	width: 20px;
	height: 20px;
	background-color: var(--white);
	border: 1px solid var(--grey300);
	border-radius: var(--radius-extra);
	transition: left calc(0.2 * 1s);
`;

const Background = styled.div<{ isActive: boolean }>`
	display: flex;
	height: 100%;
	background-color: ${({ isActive }) => (isActive ? 'var(--black)' : 'var(--grey300)')};
	border-radius: var(--radius-extra);
	box-shadow: 2px 2px 5px 0 rgba(50, 50, 50, 0.25);
	transition: background calc(0.2 * 1s);
`;

export default Switch;
