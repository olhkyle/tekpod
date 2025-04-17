import styled from '@emotion/styled';

const SkeletonLoader = styled.div<{
	width: `${number}px` | `${number}%`;
	height: `${number}px` | `${number}%`;
}>`
	position: relative;
	width: ${({ width }) => width};
	height: ${({ height }) => height};
	background-color: var(--greyOpacity50);
	border-radius: var(--radius-s);
	overflow: hidden;

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
		background: linear-gradient(90deg, transparent 0%, var(--grey100) 50%, transparent 100%);
		background-size: 200% 100%;
		animation: shimmer 2s infinite;
	}
`;

export default SkeletonLoader;
