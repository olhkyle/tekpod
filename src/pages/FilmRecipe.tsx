import styled from '@emotion/styled';

const FilmRecipePage = () => {
	return (
		<section>
			<Title>📷 Fuji Film Recipe</Title>
			<Description>
				with <span>Fuji x100f</span>
			</Description>
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
