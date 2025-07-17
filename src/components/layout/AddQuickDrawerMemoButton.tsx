import styled from '@emotion/styled';
import { MdOutlineAdd } from 'react-icons/md';
import { Button } from '..';
import { useDrawerStore } from '../../store';
import { customPropReceiver } from '../../constants';

const AddQuickDrawerMemoButton = () => {
	const { isOpen, toggle } = useDrawerStore();

	return (
		<Container type="button" onClick={toggle} aria-label="Add quick memo">
			<RotatableSvg size={24} color="var(--black)" $isActive={isOpen} />
		</Container>
	);
};

const Container = styled(Button)`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	width: 30px;
	height: 30px;
	cursor: pointer;
`;

const RotatableSvg = styled(MdOutlineAdd, customPropReceiver)<{ $isActive: boolean }>`
	transform: ${({ $isActive }) => ($isActive ? 'rotate(45deg)' : 'rotate(0deg)')};
	transition: transform 0.1s ease-in-out;
`;

export default AddQuickDrawerMemoButton;
