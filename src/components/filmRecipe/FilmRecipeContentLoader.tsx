import { SkeletonLoader } from '../common';

const FilmRecipeContentLoader = () => {
	return (
		<div css={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '32px' }}>
			{Array.from({ length: 3 }, (_, idx) => (
				<SkeletonLoader key={idx} width={'100%'} height={'32px'} />
			))}
		</div>
	);
};

export default FilmRecipeContentLoader;
