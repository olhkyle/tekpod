import { SkeletonLoader } from '../../common';

const RecordsLoader = () => {
	return (
		<div
			css={{
				display: 'grid',
				gridTemplateColumns: 'repeat(5, 1fr)',
				gap: '8px',
				margin: '32px auto',
			}}>
			{Array.from({ length: 30 }, (_, idx) => (
				<SkeletonLoader key={idx} width={'100%'} height={'80px'} />
			))}
		</div>
	);
};

export default RecordsLoader;
