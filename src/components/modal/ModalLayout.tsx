import { ReactNode } from 'react';
import styled from '@emotion/styled';
import { CgClose } from 'react-icons/cg';
import { ModalDataType } from './modalType';
import { useOverlayFixed } from '../../hooks';

interface ModalLayoutProps {
	id: string;
	isOpen: boolean;
	type: ModalDataType;
	title: string | ReactNode;
	onClose: () => void;
	children: ReactNode;
}

const ModalLayout = ({ id, isOpen, type, title, onClose, children }: ModalLayoutProps) => {
	useOverlayFixed(isOpen);

	return (
		<Container isOpen={isOpen} data-modal-type={type} data-modal-id={id}>
			<Header>
				<Title>{title}</Title>
				<CloseButton type="button" onClick={onClose}>
					<CgClose size="24" color="var(--black)" />
				</CloseButton>
			</Header>
			<Body>{children}</Body>
		</Container>
	);
};

const Container = styled.div<{ isOpen: boolean }>`
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	padding: var(--padding-container-mobile);
	height: 85dvh;
	background-color: var(--white);
	border-top-left-radius: var(--radius-l);
	border-top-right-radius: var(--radius-l);
	visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
	transition: transform 0.3s ease, visibility 0.5s ease;
	z-index: var(--modal-index);
	animation: ${({ isOpen }) => (isOpen ? 'slideUp 0.3s ease forwards' : 'slideDown 0.3s ease forwards')};

	@keyframes slideUp {
		from {
			transform: translateY(100%);
		}
		to {
			transform: translateY(0);
		}
	}

	@keyframes slideDown {
		from {
			transform: translateY(0);
		}
		to {
			transform: translateY(100%);
		}
	}
`;

const Header = styled.div`
	display: flex;
	justify-content: space-between;
`;

const Title = styled.h2`
	font-size: var(--fz-h5);
	font-weight: var(--fw-bold);
`;

const CloseButton = styled.button`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	padding: calc(var(--padding-container-mobile) / 4);
`;

const Body = styled.div`
	height: calc(100% - var(--nav-height));
	overflow-y: scroll;
`;

export default ModalLayout;
