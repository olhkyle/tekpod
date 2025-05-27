import { SkeletonLoader } from '..';

const TodoListLoader = () => {
	return (
		<div css={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '32px' }}>
			{Array.from({ length: 9 }, (_, idx) => (
				<SkeletonLoader key={idx} width={'100%'} height={'50px'} />
			))}
		</div>
	);
};

export default TodoListLoader;
