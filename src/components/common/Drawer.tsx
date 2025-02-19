import styled from '@emotion/styled';
import { ReactNode } from 'react';
import Button from './Button';
import { Portal } from '../layout';

// TODO:
// 1 - top | bottom 위치에 따른 변화
// 2 - mobile 환경에 맞는 애니메이션

interface DrawerProps {
	position: 'top' | 'bottom';
	isOpen: boolean;
	open?: () => void;
	close: () => void;
	toggle?: () => void;
	children: ReactNode;
}

const Drawer = ({ position, isOpen, close, children }: DrawerProps) => {
	return (
		<Portal>
			{isOpen && (
				<>
					<Container role="dialog" position={position}>
						<GrabArea isShown={position === 'bottom'}></GrabArea>
						<Body>{children}</Body>
						<AdditionalActions isShown={position === 'top'}>
							<Button type="button" onClick={close}>
								Close
							</Button>
						</AdditionalActions>
					</Container>
					<Overlay onClick={close} />
				</>
			)}
		</Portal>
	);
};

const Container = styled.div<{ position: 'top' | 'bottom' }>`
	position: fixed;
	top: ${({ position }) => (position === 'top' ? '0' : 'auto')};
	left: 0;
	right: 0;
	bottom: ${({ position }) => (position === 'bottom' ? '0' : 'auto')};
	padding: var(--padding-container-mobile);
	border-radius: ${({ position }) => (position === 'top' ? '0 0 var(--radius-l) var(--radius-l)' : 'var(--radius-l) var(--radius-l) 0 0')};
	background-color: var(--white);
	z-index: var(--drawer-index);
`;

const GrabArea = styled.div<{ isShown: boolean }>`
	display: ${({ isShown }) => (isShown ? 'block' : 'none')};
	margin: 16px auto 0;
	width: 100px;
	height: 8px;
	border-radius: var(--radius-extra);
	background-color: var(--greyOpacity100);
`;

const Body = styled.div`
	height: auto;
`;

const AdditionalActions = styled.div<{ isShown: boolean }>`
	display: ${({ isShown }) => (isShown ? 'flex' : 'none')};
	justify-content: flex-end;
`;

const Overlay = styled.div`
	position: fixed;
	max-width: var(--max-app-width);
	min-width: var(--min-app-width);
	margin: 0 auto;
	height: 100dvh;
	background-color: rgba(0, 0, 0, 30%);
	inset: 0px;
	z-index: calc(var(--drawer-index) - 1);
`;

export default Drawer;
