import { SkeletonLoader } from '../../common';

const ExpenseChartLoader = () => {
	return (
		<div css={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
			<div css={{ marginTop: '32px' }}>
				<SkeletonLoader width={'100%'} height={'400px'} theme="light" />
			</div>
			<SkeletonLoader width={'100%'} height={'56px'} theme="light" />
			<div css={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
				<div css={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
					<SkeletonLoader width={'40%'} height={'23px'} theme="light" />
					<SkeletonLoader width={'100%'} height={'56px'} theme="light" />
				</div>
				<div css={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
					<SkeletonLoader width={'40%'} height={'23px'} theme="light" />
					<SkeletonLoader width={'100%'} height={'56px'} theme="light" />
				</div>
			</div>
		</div>
	);
};

export default ExpenseChartLoader;
