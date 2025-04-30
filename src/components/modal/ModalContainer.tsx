import styled from '@emotion/styled';
import { Portal } from '..';
import { useModalStore } from '../../store';

const ModalContainer = () => {
	const { modals, removeModal } = useModalStore();

	return (
		<Portal>
			<Container id="modal-container">
				{modals.map(({ Component, props }, index) => {
					const closeModal = () => removeModal(Component);

					if (props) {
						return <Component key={index} id={index} onClose={closeModal} {...props} />;
					}
				})}
			</Container>
		</Portal>
	);
};

const Container = styled.div`
	position: relative;
	max-width: var(--max-app-width);
	min-width: var(--min-app-width);
	margin: 0 auto;
	height: 100dvh;
	z-index: calc(var(--modal-index) - 1);
`;

export default ModalContainer;
