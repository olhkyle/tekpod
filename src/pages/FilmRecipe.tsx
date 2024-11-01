import { Suspense } from 'react';
import styled from '@emotion/styled';
import { FilmRecipeContent, FilmRecipeContentLoader } from '../components';

const FilmRecipePage = () => {
	return (
		<section>
			<Title>📷 FujiX Recipe</Title>
			<Description>
				with <span>Fuji x100f</span>
			</Description>
			<Suspense fallback={<FilmRecipeContentLoader />}>
				<FilmRecipeContent />
			</Suspense>
		</section>
	);
};

const Title = styled.h2`
	font-size: var(--fz-h5);
	font-weight: var(--fw-black);
	color: var(--grey900);
`;

const Description = styled.p`
	span {
		display: inline-block;
		padding: calc(var(--padding-container-mobile) * 0.3);
		font-weight: var(--fw-semibold);
		color: var(--grey700);
		background-color: var(--greyOpacity100);
		border-radius: var(--radius-s);
	}
`;

export default FilmRecipePage;
