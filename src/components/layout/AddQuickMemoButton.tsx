import { useState } from 'react';
import styled from '@emotion/styled';
import { MdOutlineAdd } from 'react-icons/md';
import { Button } from '../common';
import { customPropReceiver } from '../../constants';

const AddQuickMemoButton = () => {
	const [isActive, setIsActive] = useState(false);

	return (
		<StyledButton type="button" onClick={() => setIsActive(!isActive)}>
			<RotatableSvg size={24} color="var(--black)" $isActive={isActive} />
		</StyledButton>
	);
};

const StyledButton = styled(Button)`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	width: 27px;
	height: 27px;
	cursor: pointer;
`;

const RotatableSvg = styled(MdOutlineAdd, customPropReceiver)<{ $isActive: boolean }>`
	transform: ${({ $isActive }) => ($isActive ? 'rotate(45deg)' : 'rotate(0deg)')};
	transition: transform 0.1s ease-in-out;
`;

export default AddQuickMemoButton;
