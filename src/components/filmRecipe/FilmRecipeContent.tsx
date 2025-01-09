import styled from '@emotion/styled';
import useModalStore, { QueryRefetch } from '../../store/useModalStore';
import { EmptyMessage } from '../common';
import { RestrictedRecipe } from '../../supabase/schema';
import { MODAL_CONFIG } from '../modal/modalType';

interface FilmRecipeContentProps {
	recipes: RestrictedRecipe[];
	refetch: QueryRefetch;
}

const FilmRecipeContent = ({ recipes, refetch }: FilmRecipeContentProps) => {
	const { setModal } = useModalStore();

	const handleIndividualFilmRecipeModal = (targetTitle: string) => {
		setModal({
			Component: MODAL_CONFIG.FILM_RECIPE.READ.Component,
			props: {
				type: MODAL_CONFIG.FILM_RECIPE.READ.type,
				data: recipes.find(({ title }) => title === targetTitle)!,
				refetch,
			},
		});
	};

	return (
		<Container>
			{recipes.length === 0 && <EmptyMessage emoji={'📷'}>{'ADD RECIPE PLEASE'}</EmptyMessage>}
			{recipes.map(({ title, film_simulation, primary }, idx) => (
				<Recipe key={idx} primary={primary} onClick={() => handleIndividualFilmRecipeModal(title)}>
					<Title>
						<NumberCount primary={primary}>{idx + 1}</NumberCount>
						<span>{title}</span>
					</Title>
					<FilmSimulation>{film_simulation}</FilmSimulation>
				</Recipe>
			))}
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin-top: 24px;
`;

const Recipe = styled.div<{ primary: boolean }>`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: calc(var(--padding-container-mobile) * 1.2) calc(var(--padding-container-mobile) * 0.5);
	border-bottom: 1px solid var(--greyOpacity100);
	transition: background 0.15s ease-in-out;
	cursor: pointer;

	&:first-of-type {
		border-top: 1px solid var(--greyOpacity100);
	}

	&:hover,
	&:focus {
		background-color: ${({ primary }) => (primary ? 'var(--blue100)' : ' var(--greyOpacity50)')};
	}
`;

const Title = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 8px;
	font-size: var(--fz-h7);
	font-weight: var(--fw-bold);
`;

const NumberCount = styled.span<{ primary: boolean }>`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	width: 20px;
	height: 20px;
	font-size: var(--fz-sm);
	font-weight: var(--fw-semibold);
	color: ${({ primary }) => (primary ? 'var(--white)' : 'var(--grey700)')};
	background-color: ${({ primary }) => (primary ? 'var(--blue200)' : 'var(--grey200)')};
`;

const FilmSimulation = styled.span`
	display: inline-block;
	padding: calc(var(--padding-container-mobile) * 0.25) calc(var(--padding-container-mobile) * 0.45);
	font-weight: var(--fw-medium);
	color: var(--grey700);
	background-color: var(--greyOpacity100);
	border-radius: var(--radius-s);
`;

export default FilmRecipeContent;
