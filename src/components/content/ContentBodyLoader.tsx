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
	width: 100dvw;
	height: 100dvh;
`;

const Loader = styled.div`
	width: 100%;
	height: calc(100dvh / 10);
	background-color: var(--greyOpacity200);
`;

export default ContentBodyLoader;
