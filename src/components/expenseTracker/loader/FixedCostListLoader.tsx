import { SkeletonLoader } from '../../common';

const FixedCostListLoader = () => {
	return (
		<div
			css={{
				display: 'flex',
				flexDirection: 'column',
				gap: '16px',
				margin: '16px 0',
			}}>
			<SkeletonLoader width={'100%'} height={'100px'} />
			<SkeletonLoader width={'100%'} height={'100px'} />
			<SkeletonLoader width={'100%'} height={'100px'} />
			<SkeletonLoader width={'100%'} height={'100px'} />
			<SkeletonLoader width={'100%'} height={'100px'} />
		</div>
	);
};

export default FixedCostListLoader;
