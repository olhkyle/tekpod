import useDrawerStore from '../../store/useDrawerStore';
import { Drawer } from '../common';

const QuickMemoDrawer = () => {
	const { isOpen, close } = useDrawerStore();

	return (
		<Drawer position={'top'} isOpen={isOpen} close={close}>
			<div>what do you want to add?</div>
			<button type="button">Submit</button>
		</Drawer>
	);
};

export default QuickMemoDrawer;
