import { SkeletonLoader } from '../common';

const ContentBodyLoader = () => {
	return (
		<div css={{ display: 'flex', flexDirection: 'column' }}>
			<div css={{ display: 'flex', justifyContent: 'flex-end' }}>
				<SkeletonLoader width={'60px'} height={'40px'} />
			</div>
			<div
				css={{
					display: 'flex',
					flexDirection: 'column',
					marginTop: 'calc(100dvh / 25)',
					padding: 'calc(var(--padding-container-mobile) * 2) var(--padding-container-mobile)',
					backgroundColor: 'var(--greyOpacity50)',
					borderRadius: 'var(--radius-s)',
				}}>
				<SkeletonLoader width={'100%'} height={'48px'} />
				<div css={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '16px 0' }}>
					<SkeletonLoader width={'100%'} height={'25px'} />
					<SkeletonLoader width={'100%'} height={'25px'} />
					<SkeletonLoader width={'100%'} height={'25px'} />
				</div>
				<SkeletonLoader width={'100%'} height={'56px'} />
			</div>
		</div>
	);
};

export default ContentBodyLoader;
