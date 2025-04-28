import { AnimationEvent, ReactNode, useState } from 'react';
import styled from '@emotion/styled';
import { CgClose } from 'react-icons/cg';
import { Button } from '..';
import { type ModalDataType } from '.';
import { useOverlayFixed, useTriggerEscape } from '../../hooks';

interface ModalLayoutProps {
	id: string;
	type: ModalDataType;
	title: string | ReactNode;
	onClose: () => void;
	children: ReactNode;
}

const ModalLayout = ({ id, type, title, onClose, children }: ModalLayoutProps) => {
	const [isClosing, setIsClosing] = useState(false);
	useOverlayFixed(!isClosing);

	const handleModalClose = () => setIsClosing(true);

	useTriggerEscape({ condition: !isClosing, trigger: handleModalClose });

	const handleAnimationEnd = (e: AnimationEvent<HTMLDivElement>) => {
		if (isClosing && e.target === e.currentTarget) {
			onClose();
		}
	};

	return (
		<Container
			isVisible={!isClosing}
			order={+id.split('-')[1]}
			data-modal-type={type}
			data-modal-id={id}
			onAnimationEnd={handleAnimationEnd}>
			<Header id={`${id}-header`}>
				<Title>{title}</Title>
				<CloseButton type="button" onClick={handleModalClose}>
					<CgClose size="24" color="var(--black)" />
				</CloseButton>
			</Header>
			<Body id={`${id}-body`}>{children}</Body>
		</Container>
	);
};

const Container = styled.div<{ isVisible: boolean; order: number }>`
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	padding: var(--padding-container-mobile);
	background-color: ${({ order }) => (order === 0 ? 'var(--white)' : `var(--grey50)`)};
	border-top-left-radius: var(--radius-l);
	border-top-right-radius: var(--radius-l);
	border-top: ${({ order }) => (order === 0 ? 'none' : '1px solid var(--grey100)')};
	transition: transform 0.3s ease;
	z-index: var(--modal-index);
	animation: ${({ isVisible }) => (isVisible ? 'slideModalUp 0.3s ease forwards' : 'slideModalDown 0.2s ease forwards')};
	-webkit-animation: ${({ isVisible }) => (isVisible ? 'slideModalUp 0.3s ease forwards' : 'slideModalDown 0.2s ease forwards')};
	-webkit-overflow-scrolling: touch; // iOS scroll support
	-ms-overflow-style: none; // IE and Edge
	scrollbar-width: none; // Firefox
	&::-webkit-scrollbar {
		display: none; // hide scrollbar (optional)
	}

	@keyframes slideModalUp {
		from {
			transform: translate3d(0, 100%, 0);
		}
		to {
			transform: translate3d(0, 0, 0);
		}
	}

	@keyframes slideModalDown {
		from {
			transform: translate3d(0, 0, 0);
		}
		to {
			transform: translate3d(0, 100%, 0);
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

const CloseButton = styled(Button)`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	padding: calc(var(--padding-container-mobile) / 4);
`;

const Body = styled.div`
	max-height: calc(100dvh - var(--nav-height) * 3);
	overflow-y: scroll;

	scrollbar-width: none; // Firefox
	&::-webkit-scrollbar {
		display: none; // hide scrollbar
	}
`;

export default ModalLayout;
