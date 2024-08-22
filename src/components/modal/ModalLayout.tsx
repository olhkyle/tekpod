import { ReactNode } from 'react';
import styled from '@emotion/styled';
import { CgClose } from 'react-icons/cg';

interface ModalLayoutProps {
	id: string;
	isOpen: boolean;
	title: string | ReactNode;
	onClose: () => void;
	children: ReactNode;
}

const ModalLayout = ({ id, isOpen, title, onClose, children }: ModalLayoutProps) => {
	return (
		<Container isOpen={isOpen} data-modal-id={id}>
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
	height: 80dvh;
	background-color: var(--white);
	border-top-left-radius: var(--radius-xl);
	border-top-right-radius: var(--radius-xl);
	visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'none')};
	transition: visibility 0.3s ease-in-out;
	z-index: var(--modal-index);
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
	height: 100%;
`;

export default ModalLayout;
