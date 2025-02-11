import styled from '@emotion/styled';

const WorkInProgress = () => {
	return <Container>WorkInProgress 🛞</Container>;
};

const Container = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 200px;
	background-color: var(--grey50);
	font-weight: var(--black);
	border: 1px solid var(--grey100);
	border-radius: var(--radius-l);
`;

export default WorkInProgress;
