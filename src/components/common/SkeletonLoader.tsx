import styled from '@emotion/styled';

const SkeletonLoader = styled.div<{
	width: `${number}px` | `${number}%`;
	height: `${number}px` | `${number}%`;
	theme: 'light' | 'dark';
}>`
	--linear-gradient: linear-gradient(to right, var(--blue100), var(--grey100), var(--blue100));

	position: relative;
	width: ${({ width }) => width};
	height: ${({ height }) => height};
	background-color: ${({ theme }) =>
		theme === 'light' ? 'var(--greyOpacity50)' : theme === 'dark' ? 'var(--grey800)' : 'var(--greyOpactiy50)'};
	border-radius: var(--radius-s);
	overflow: hidden;

	@keyframes loading {
		0% {
			transform: translate3d(0, 0, 0);
		}
		50%,
		100% {
			transform: translate3d(450px, 0, 0);
		}
	}

	@keyframes shimmer {
		0% {
			background-position: -200% 0;
		}
		100% {
			background-position: 200% 0;
		}
	}

	&::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		inset: 0;
		background: linear-gradient(90deg, transparent 0%, var(--blue100) 50%, transparent 100%);
		background-size: 200% 100%;
		animation: shimmer 2s infinite;
	}
`;

export default SkeletonLoader;
