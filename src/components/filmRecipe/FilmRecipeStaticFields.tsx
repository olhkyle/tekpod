import styled from '@emotion/styled';
import { RestricedRecipeWithImage } from '../../supabase/schema';

interface FilmRecipeStaticFieldsProps {
	data: RestricedRecipeWithImage;
}

const FilmRecipeStaticFields = ({ data }: FilmRecipeStaticFieldsProps) => {
	return (
		<InfoList>
			<li>
				<label>FILM SIMULATION</label>
				<p>{data?.film_simulation}</p>
			</li>
			<li>
				<label>DYNAMIC RANGE</label>
				<p>{data?.dynamic_range}</p>
			</li>
			<li>
				<label>GRAIN EFFECT</label>
				<p>{data?.grain_effect}</p>
			</li>
			<li>
				<label>WB</label>
				<p>{data?.wb}</p>
			</li>
			<li>
				<label>HIGHLIGHT</label>
				<p>{data?.highlight}</p>
			</li>
			<li>
				<label>SHADOW</label>
				<p>{data?.shadow}</p>
			</li>
			<li>
				<label>COLOR</label>
				<p>{data?.color}</p>
			</li>
			<li>
				<label>SHARPNESS</label>
				<p>{data?.sharpness}</p>
			</li>
			<li>
				<label>NOISE REDUCTION</label>
				<p>{data?.noise_reduction}</p>
			</li>
			<li>
				<label>ISO</label>
				<p>{data?.iso}</p>
			</li>
			<li>
				<label>EXPOSURE COMPENSATION</label>
				<p>{data?.exposure_compensation}</p>
			</li>
			<li>
				<label>SENSORS</label>
				<p>{data?.sensors}</p>
			</li>
		</InfoList>
	);
};

const InfoList = styled.ul`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	border-top: 1px solid var(--greyOpacity100);

	li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 0;
		border-bottom: 1px solid var(--greyOpacity100);

		label {
			font-weight: var(--fw-medium);
		}
	}
`;

export default FilmRecipeStaticFields;
