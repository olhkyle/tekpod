import { AnimationEvent, ReactNode, useState } from 'react';
import styled from '@emotion/styled';
import { CgClose } from 'react-icons/cg';
import { Button } from '../common';
import type { ModalDataType } from './modalType';
import { useOverlayFixed } from '../../hooks';

interface ModalLayoutProps {
	id: string;
	type: ModalDataType;
	title: string | ReactNode;
	onClose: () => void;
	bottomSheetType?: 'plain' | 'doubleCheck';
	children: ReactNode;
}

const ModalLayout = ({ id, type, title, onClose, bottomSheetType = 'plain', children }: ModalLayoutProps) => {
	const [isClosing, setIsClosing] = useState(false);

	useOverlayFixed(!isClosing);

	const handleModalClose = () => {
		setIsClosing(true);
	};

	const handleAnimationEnd = (e: AnimationEvent<HTMLDivElement>) => {
		if (isClosing && e.target === e.currentTarget) {
			onClose();
		}
	};

	return (
		<Container
			isVisible={!isClosing}
			bottomSheetType={bottomSheetType}
			order={+id.split('-')[1]}
			data-modal-type={type}
			data-modal-id={id}
			onAnimationEnd={handleAnimationEnd}>
			<Header>
				<Title>{title}</Title>
				<CloseButton type="button" onClick={handleModalClose}>
					<CgClose size="24" color="var(--black)" />
				</CloseButton>
			</Header>
			<Body>{children}</Body>
		</Container>
	);
};

const Container = styled.div<{ isVisible: boolean; bottomSheetType: 'plain' | 'doubleCheck'; order: number }>`
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	padding: var(--padding-container-mobile);
	height: ${({ bottomSheetType }) => (bottomSheetType === 'plain' ? ' 85dvh' : 'auto')};
	background-color: ${({ order }) => (order === 0 ? 'var(--white)' : `var(--grey50)`)};
	border-top-left-radius: var(--radius-l);
	border-top-right-radius: var(--radius-l);
	transition: transform 0.3s ease;
	z-index: var(--modal-index);
	animation: ${({ isVisible }) => (isVisible ? 'slideUp 0.3s ease forwards' : 'slideDown 0.2s ease forwards')};
	-webkit-animation: ${({ isVisible }) => (isVisible ? 'slideUp 0.3s ease forwards' : 'slideDown 0.2s ease forwards')};

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

const CloseButton = styled(Button)`
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
