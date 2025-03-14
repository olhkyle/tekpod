import styled from '@emotion/styled';
import { SkeletonLoader } from '..';

const TodoListLoader = () => {
	return (
		<Container>
			{Array.from({ length: 3 }, (_, idx) => (
				<SkeletonLoader key={idx} theme={'light'} width={'100%'} height={'32px'} />
			))}
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	margin-top: 32px;
`;

export default TodoListLoader;
