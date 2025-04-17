import { SkeletonLoader } from '..';

const DiaryContentLoader = () => {
	return (
		<div css={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '32px' }}>
			{Array.from({ length: 5 }, (_, idx) => (
				<div
					key={`diary-content-${idx}`}
					css={{
						display: 'flex',
						flexDirection: 'column',
						gap: '8px',
						padding: 'var(--padding-container-mobile)',
						backgroundColor: 'var(--greyOpacity50)',
						borderRadius: 'var(--radius-s)',
					}}>
					<SkeletonLoader width={'40%'} height={'36px'} />
					<SkeletonLoader width={'100%'} height={'22px'} />
					<SkeletonLoader width={'100%'} height={'22px'} />
					<SkeletonLoader width={'100%'} height={'22px'} />
					<SkeletonLoader width={'100%'} height={'30px'} />
					<div css={{ display: 'flex', gap: '8px' }}>
						<SkeletonLoader width={'30%'} height={'28px'} />
						<SkeletonLoader width={'30%'} height={'28px'} />
						<SkeletonLoader width={'30%'} height={'28px'} />
					</div>
				</div>
			))}
		</div>
	);
};

export default DiaryContentLoader;
