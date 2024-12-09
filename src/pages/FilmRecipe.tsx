import styled from '@emotion/styled';
import { AddFilmRecipeModal, Button, FilmRecipeContent } from '../components';
import useModalStore from '../store/useModalStore';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRecipes } from '../supabase/filmRecipe';
import queryKey from '../constants/queryKey';

const FilmRecipePage = () => {
	const { data: recipes, refetch } = useSuspenseQuery({ queryKey: queryKey.FILM_RECIPE, queryFn: getRecipes });

	const { setModal } = useModalStore();

	const handleAddFilmRecipeModal = () => {
		setModal({
			Component: AddFilmRecipeModal,
			props: { type: 'recipe', data: null, refetch },
		});
	};

	return (
		<section>
			<Header>
				<Title>📷 FujiX Recipe</Title>
				<AddButton type="button" onClick={handleAddFilmRecipeModal}>
					ADD
				</AddButton>
			</Header>
			<Description>
				with <span>Fuji x100f</span>
			</Description>

			<FilmRecipeContent recipes={recipes} refetch={refetch} />
		</section>
	);
};

const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const Title = styled.h2`
	font-size: var(--fz-h5);
	font-weight: var(--fw-black);
	color: var(--grey900);
`;

const AddButton = styled(Button)`
	padding: calc(var(--padding-container-mobile) * 0.5) var(--padding-container-mobile);
	min-height: 40px;
	background-color: var(--black);
	color: var(--white);
	font-size: var(--fz-p);
	font-weight: var(--fw-bold);

	&:hover,
	&:active {
		background-color: var(--grey900);
	}
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
