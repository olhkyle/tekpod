import styled from '@emotion/styled';

const ContentBodyLoader = () => {
	return (
		<Container>
			<Loader />
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100dvh;
`;

const Loader = styled.div`
	--linear-gradient: linear-gradient(to right, var(--blue100), var(--grey100), var(--blue100));
	position: relative;
	width: 100%;
	height: calc(100dvh / 5);
	background-color: var(--greyOpacity50);
	border-radius: var(--radius-m);
	overflow: hidden;

	@keyframes loading {
		0% {
			transform: translateX(0);
		}
		50%,
		100% {
			transform: translateX(460px);
		}
	}

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 32px;
		height: 100%;
		background: var(--linear-gradient);
		animation: loading 3s infinite linear;
	}
`;

export default ContentBodyLoader;
