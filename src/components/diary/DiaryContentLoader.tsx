import styled from '@emotion/styled';

const DiaryContentLoader = () => {
	return (
		<Container>
			<Loader />
			<Loader />
			<Loader />
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	margin-top: 32px;
`;

const Loader = styled.div`
	--linear-gradient: linear-gradient(to right, var(--blue100), var(--grey100), var(--blue100));
	position: relative;
	width: 60%;
	height: 32px;
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

export default DiaryContentLoader;
