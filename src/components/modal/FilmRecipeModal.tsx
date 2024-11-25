import { useState } from 'react';
import styled from '@emotion/styled';
import { RestricedRecipeWithImage } from '../../supabase/schema';
import type { ModalDataType } from './modalType';
import { ModalLayout, RemoveFilmRecipeConfirmModal, LazyImage } from '..';
import useModalStore, { QueryRefetch } from '../../store/useModalStore';

interface FilmRecipeModalProps {
	id: string;
	data: RestricedRecipeWithImage;
	isOpen: boolean;
	type: ModalDataType;
	refetch: QueryRefetch;
	onClose: () => void;
}

const FilmRecipeModal = ({ id, data, isOpen, type, refetch, onClose }: FilmRecipeModalProps) => {
	const { setModal } = useModalStore();

	const [isDeleteConfirmModalOpen] = useState(true);

	const handleDeleteConfirmModal = () => {
		setModal({
			Component: RemoveFilmRecipeConfirmModal,
			props: {
				isOpen: isDeleteConfirmModalOpen,
				data,
				type: 'recipe',
				refetch,
				onTopLevelModalClose: onClose,
			},
		});
	};

	return (
		<ModalLayout id={id} isOpen={isOpen} type={type} title={data?.title} onClose={onClose}>
			<Group>
				<LazyImage
					src={data?.imgSrc.includes(import.meta.env.VITE_SUPABASE_FILMRECIPE_URL) ? data?.imgSrc : '/sample.jpg'}
					alt="recipe sample image"
					width={'100%'}
					height={'100%'}
					lazy={true}
				/>

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
			</Group>
			<ButtonGroup>
				<EditRecipeButton type="button">✏️ Edit</EditRecipeButton>
				<DeleteRecipeButton type="button" onClick={handleDeleteConfirmModal}>
					🗑️ Delete
				</DeleteRecipeButton>
			</ButtonGroup>
		</ModalLayout>
	);
};

const Group = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	/* height: calc(100dvh - var(--nav-height)); */
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

const ButtonGroup = styled.div`
	display: flex;
	justify-content: space-between;
	gap: 16px;
	margin-top: calc(var(--padding-container-mobile) * 8);
`;

const Button = styled.button`
	padding: var(--padding-container-mobile);
	width: 100%;
	min-height: 57px;
	color: var(--white);
	font-size: var(--fz-p);
	font-weight: var(--fw-semibold);
	transition: background 0.15s ease-in-out;
`;

const EditRecipeButton = styled(Button)`
	background-color: var(--black);

	&:active,
	&:focus {
		background-color: var(--greyOpacity900);
	}

	&:disabled {
		background-color: var(--greyOpacity400);
	}
`;

const DeleteRecipeButton = styled(Button)`
	background-color: var(--grey200);
	color: var(--grey700);

	&:active,
	&:focus {
		background-color: var(--greyOpacity300);
	}
`;

export default FilmRecipeModal;
