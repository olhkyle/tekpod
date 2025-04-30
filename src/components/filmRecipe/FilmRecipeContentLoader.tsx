import { SkeletonLoader } from '../common';

const FilmRecipeContentLoader = () => {
	return (
		<div css={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '24px', height: '100%' }}>
			{Array.from({ length: 10 }, (_, idx) => (
				<SkeletonLoader key={idx} width={'100%'} height={'70px'} />
			))}
		</div>
	);
};

export default FilmRecipeContentLoader;
