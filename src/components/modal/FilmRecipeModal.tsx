import ModalLayout from './ModalLayout';
import { RestricedRecipeWithImage } from '../../supabase/schema';
import styled from '@emotion/styled';
import { ModalDataType } from './modalType';
import { LazyImage } from '../common';
import useOverlayFixed from '../../hooks/useOverlayFixed';

interface FilmRecipeModalProps {
	id: string;
	data: RestricedRecipeWithImage;
	isOpen: boolean;
	type: ModalDataType;
	title: string;
	onClose: () => void;
}

const FilmRecipeModal = ({
	id,
	data: {
		title,
		film_simulation,
		dynamic_range,
		grain_effect,
		wb,
		highlight,
		shadow,
		color,
		sharpness,
		noise_reduction,
		iso,
		exposure_compensation,
		sensors,
		imgSrc,
	},
	isOpen,
	type,
	onClose,
}: FilmRecipeModalProps) => {
	useOverlayFixed(isOpen);
	console.log(title, imgSrc);
	return (
		<ModalLayout id={id} isOpen={isOpen} type={type} title={title} onClose={onClose}>
			<Group>
				<LazyImage src={imgSrc ?? '/sample.jpg'} alt="recipe sample image" width={'100%'} height={'100%'} lazy={true} />

				<InfoList>
					<li>
						<label>FILM SIMULATION</label>
						<p>{film_simulation}</p>
					</li>
					<li>
						<label>DYNAMIC RANGE</label>
						<p>{dynamic_range}</p>
					</li>
					<li>
						<label>GRAIN EFFECT</label>
						<p>{grain_effect}</p>
					</li>
					<li>
						<label>WB</label>
						<p>{wb}</p>
					</li>
					<li>
						<label>HIGHLIGHT</label>
						<p>{highlight}</p>
					</li>
					<li>
						<label>SHADOW</label>
						<p>{shadow}</p>
					</li>
					<li>
						<label>COLOR</label>
						<p>{color}</p>
					</li>
					<li>
						<label>SHARPNESS</label>
						<p>{sharpness}</p>
					</li>
					<li>
						<label>NOISE REDUCTION</label>
						<p>{noise_reduction}</p>
					</li>
					<li>
						<label>ISO</label>
						<p>{iso}</p>
					</li>
					<li>
						<label>EXPOSURE COMPENSATION</label>
						<p>{exposure_compensation}</p>
					</li>
					<li>
						<label>SENSORS</label>
						<p>{sensors}</p>
					</li>
				</InfoList>
			</Group>
			<EditRecipeButton type="button">✏️ Edit</EditRecipeButton>
		</ModalLayout>
	);
};

const Group = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	height: calc(100dvh - var(--nav-height));
	margin-top: 8px;
	background-color: var(--white);
`;

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

const EditRecipeButton = styled.button`
	margin-top: calc(var(--padding-container-mobile) * 8);
	padding: var(--padding-container-mobile);
	width: 100%;
	min-height: 57px;
	color: var(--white);
	background-color: var(--black);
	font-size: var(--fz-p);
	font-weight: var(--fw-semibold);
	transition: background 0.15s ease-in-out;

	&:active,
	&:focus {
		background-color: var(--greyOpacity900);
	}

	&:disabled {
		background-color: var(--greyOpacity400);
	}
`;

export default FilmRecipeModal;
