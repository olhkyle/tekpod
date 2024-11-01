import { motion } from 'framer-motion';
import useToastStore from '../../store/useToastStore';
import styled from '@emotion/styled';
import { useToastUnsubscribe } from '../../hooks';

const Toast = () => {
	const { toast } = useToastStore();

	useToastUnsubscribe();

	return (
		<MotionWrapper
			isToastNull={toast === null}
			initial={{ y: '100%', opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			whileInView={{ y: '50%', opacity: 1 }}
			exit={{ y: '100%', opacity: 0 }}
			transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}>
			<Container>
				<Status status={toast?.status ?? 'info'} />
				<Message>{toast?.message}</Message>
			</Container>
		</MotionWrapper>
	);
};

const MotionWrapper = styled(motion.div)<{ isToastNull: boolean }>`
	position: fixed;
	display: ${({ isToastNull }) => (isToastNull ? 'none' : 'block')};
	left: var(--padding-container-mobile);
	bottom: calc(var(--nav-height) + 3 * var(--padding-container-mobile));
	z-index: var(--toast-index);
`;

const Container = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 8px;
	padding: calc(var(--padding-container-mobile) * 0.6) var(--padding-container-mobile);
	min-width: calc(100dvw - 2 * var(--padding-container-mobile));
	background-color: var(--grey100);
	border: 1px solid var(--greyOpacity200);
	border-radius: var(--radius-s);
`;

const Status = styled.span<{ status: 'success' | 'warn' | 'info' | 'error' }>`
	display: inline-block;
	width: 12px;
	height: 12px;
	border-radius: var(--radius-extra);
	background-color: ${({ status }) =>
		status === 'success'
			? 'var(--green200)'
			: status === 'warn'
			? 'var(--orange600)'
			: status === 'info'
			? 'var(--blue200)'
			: status === 'error'
			? 'var(--red200)'
			: 'var(--grey400)'};
`;

const Message = styled.p`
	font-size: var(--fz-sm);
	font-weight: var(--fw-semibold);
	color: var(--grey800);
`;

export default Toast;
