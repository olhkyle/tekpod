import { SkeletonLoader } from '..';

const TodoListLoader = () => {
	return (
		<div css={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '32px' }}>
			{Array.from({ length: 5 }, (_, idx) => (
				<SkeletonLoader key={idx} theme={'light'} width={'100%'} height={'60px'} />
			))}
		</div>
	);
};

export default TodoListLoader;
