import styled from '@emotion/styled';
import { MdOutlineAdd } from 'react-icons/md';
import useDrawerStore from '../../store/useDrawerStore';
import { Button } from '../common';
import { customPropReceiver } from '../../constants';

const AddQuickDrawerMemoButton = () => {
	const { isOpen, toggle } = useDrawerStore();

	return (
		<StyledButton type="button" onClick={toggle}>
			<RotatableSvg size={24} color="var(--black)" $isActive={isOpen} />
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

export default AddQuickDrawerMemoButton;
