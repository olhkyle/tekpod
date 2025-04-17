import { SkeletonLoader } from '../../common';

const ExpenseChartLoader = () => {
	return (
		<div css={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
			<div css={{ marginTop: '32px' }}>
				<SkeletonLoader width={'100%'} height={'400px'} />
			</div>
			<SkeletonLoader width={'100%'} height={'56px'} />
			<div css={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
				<div css={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
					<SkeletonLoader width={'40%'} height={'23px'} />
					<SkeletonLoader width={'100%'} height={'56px'} />
				</div>
				<div css={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
					<SkeletonLoader width={'40%'} height={'23px'} />
					<SkeletonLoader width={'100%'} height={'56px'} />
				</div>
			</div>
		</div>
	);
};

export default ExpenseChartLoader;
