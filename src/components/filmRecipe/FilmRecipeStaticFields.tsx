import styled from '@emotion/styled';
import { RestricedRecipeWithImage } from '../../supabase/schema';

interface FilmRecipeStaticFieldsProps {
	data: RestricedRecipeWithImage;
}

const FilmRecipeStaticFields = ({ data }: FilmRecipeStaticFieldsProps) => {
	return (
		<InfoList>
			<div>
				<dt>FILM SIMULATION</dt>
				<dd>{data?.film_simulation}</dd>
			</div>
			<div>
				<dt>DYNAMIC RANGE</dt>
				<dd>{data?.dynamic_range}</dd>
			</div>
			<div>
				<dt>GRAIN EFFECT</dt>
				<dd>{data?.grain_effect}</dd>
			</div>
			<div>
				<dt>WB</dt>
				<dd>{data?.wb}</dd>
			</div>
			<div>
				<dt>HIGHdivGHT</dt>
				<dd>{data?.highlight}</dd>
			</div>
			<div>
				<dt>SHADOW</dt>
				<dd>{data?.shadow}</dd>
			</div>
			<div>
				<dt>COLOR</dt>
				<dd>{data?.color}</dd>
			</div>
			<div>
				<dt>SHARPNESS</dt>
				<dd>{data?.sharpness}</dd>
			</div>
			<div>
				<dt>NOISE REDUCTION</dt>
				<dd>{data?.noise_reduction}</dd>
			</div>
			<div>
				<dt>ISO</dt>
				<dd>{data?.iso}</dd>
			</div>
			<div>
				<dt>EXPOSURE COMPENSATION</dt>
				<dd>{data?.exposure_compensation}</dd>
			</div>
			<div>
				<dt>SENSORS</dt>
				<dd>{data?.sensors}</dd>
			</div>
		</InfoList>
	);
};

const InfoList = styled.dl`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	border-top: 1px solid var(--greyOpacity100);

	div {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 0;
		border-bottom: 1px solid var(--greyOpacity100);

		dt {
			font-weight: var(--fw-medium);
		}
	}
`;

export default FilmRecipeStaticFields;
