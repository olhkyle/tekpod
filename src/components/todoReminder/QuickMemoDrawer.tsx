import styled from '@emotion/styled';

import useDrawerStore from '../../store/useDrawerStore';
import { Button, Drawer, TextInput } from '../common';

const QuickMemoDrawer = () => {
	const { isOpen, close } = useDrawerStore();

	return (
		<>
			{isOpen && (
				<Drawer position={'top'} isOpen={isOpen} close={close} title={'Quick Memo'}>
					<TextInput>
						<TextInput.TextField id="memo" name="memo" placeholder="Something"></TextInput.TextField>
					</TextInput>
					<SubmitButton type="submit">Submit</SubmitButton>
				</Drawer>
			)}
		</>
	);
};

const SubmitButton = styled(Button)`
	margin-top: 16px;
	padding: var(--padding-container-mobile);
	width: 100%;
	min-height: 40px;
	color: var(--white);
	background-color: var(--black);
	font-size: var(--fz-p);
	font-weight: var(--fw-semibold);
`;

export default QuickMemoDrawer;
