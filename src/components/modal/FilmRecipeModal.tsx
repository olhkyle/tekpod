import { useState } from 'react';
import styled from '@emotion/styled';
import { useQueryClient } from '@tanstack/react-query';
import { Session } from '@supabase/supabase-js';
import { editRecipe } from '../../supabase/filmRecipe';
import { RestricedRecipeWithImage, RestrictedRecipeForValidation } from '../../supabase/schema';
import type { ModalDataType } from './modalType';
import { ModalLayout, RemoveFilmRecipeConfirmModal, LazyImage, FilmRecipeImageUpload, TextInput, CustomSelect } from '..';
import useModalStore, { QueryRefetch } from '../../store/useModalStore';
import useToastStore from '../../store/useToastStore';
import { useFilmRecipeImage, useLoading } from '../../hooks';
import { FILM_RECIPE_FORM } from '../../constants/recipes';

interface FilmRecipeModalProps {
	id: string;
	data: RestricedRecipeWithImage;
	isOpen: boolean;
	type: ModalDataType;
	refetch: QueryRefetch;
	onClose: () => void;
}

const FilmRecipeModal = ({ id, data, isOpen, type, refetch, onClose }: FilmRecipeModalProps) => {
	const queryClient = useQueryClient();
	const session = queryClient.getQueryData(['auth']) as Session;
	const { setModal } = useModalStore();

	const [isEditing, setEditing] = useState<boolean>(false);
	const {
		image: { imageUrl, currentRecipeImage, isAttached },
		setImageUrlOnEditing,
		handleImageUpload,
		handleImageRemove,
	} = useFilmRecipeImage({ DEFAULT_IMAGE_SIZE: FILM_RECIPE_FORM.IMAGE.MAX_SIZE, isEditing });

	const { isLoading, Loading, startTransition } = useLoading();
	const { addToast } = useToastStore();

	const [currentFilmFeature, setCurrentFilmFeature] = useState<RestrictedRecipeForValidation>(data);
	const [isDeleteConfirmModalOpen] = useState(true);

	const handleUpdateRecipe = async () => {
		//TODO: field가 기존 data와 같지 않은지 검증 -> 굳이 업데이트 할 필요없음
		// type 구분 재검증 필요
		try {
			await startTransition(
				editRecipe({
					type: imageUrl === data?.imgSrc && !currentRecipeImage ? 'sameImage' : 'updatedImage',
					data: {
						id: data?.id,
						user_id: session?.user?.id,
						...currentFilmFeature,
						updated_at: new Date(),
						imgSrc: imageUrl === data?.imgSrc && !currentRecipeImage ? data?.imgSrc : '',
					},
					imageFile: currentRecipeImage,
				}),
			);

			addToast({ status: 'info', message: `Successfully Updated` });
			onClose();
			refetch();
		} catch (e) {
			addToast({ status: 'error', message: 'Error happens during update recipe' });
			console.error(e);
		}
	};

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

	// edit 할 때 이미지 변경이 없는 경우, storage에 업로드하는 로직 없이, database에 data?.imgSrc만 업로드 하는 형태
	// edit 할 때 이미지 변경이 있는 경우, addRecipe와 같이 storage에 업로드 후, database에 uploadImage.path를 추가

	return (
		<ModalLayout id={id} isOpen={isOpen} type={type} title={data?.title} onClose={onClose}>
			<Group>
				{isEditing ? (
					<FilmRecipeImageUpload
						isEditing={isEditing}
						imageUrl={isAttached ? imageUrl : data?.imgSrc}
						isAttached={isAttached}
						onImageUpload={handleImageUpload}
						onImageRemove={handleImageRemove}
						setImageUrlOnEditing={setImageUrlOnEditing}
					/>
				) : (
					<LazyImage
						src={data?.imgSrc.includes(import.meta.env.VITE_SUPABASE_FILMRECIPE_URL) ? data?.imgSrc : '/sample.jpg'}
						alt="recipe sample image"
						width={'100%'}
						height={'100%'}
						lazy={true}
					/>
				)}

				{isEditing ? (
					<>
						{FILM_RECIPE_FORM.FIELDS.map(({ type, data, target_id, placeholder }, idx) => {
							return type === 'input' ? (
								<TextInput key={`${type}_${idx}`} aria-label={target_id}>
									<TextInput.ControlledTextField
										id={target_id}
										name={target_id}
										placeholder={placeholder}
										value={currentFilmFeature[target_id].toString()}
										onChange={e => {
											setCurrentFilmFeature({ ...currentFilmFeature, [target_id]: e.target.value });
										}}
									/>
								</TextInput>
							) : type === 'select' ? (
								<CustomSelect
									key={`${type}_${idx}`}
									data={data}
									target_id={target_id}
									placeholder={placeholder}
									currentValue={currentFilmFeature[target_id]}
									isTriggered={true}
									onSelect={(option: string | number) => {
										setCurrentFilmFeature({ ...currentFilmFeature, [target_id]: option });
									}}
								/>
							) : null;
						})}
					</>
				) : (
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
				)}
			</Group>
			<ButtonGroup>
				{isEditing ? (
					<>
						<CancelButton type="button" onClick={() => setEditing(false)}>
							Cancel
						</CancelButton>
						<UpdateButton type="button" onClick={handleUpdateRecipe}>
							{isLoading ? Loading : 'Update'}
						</UpdateButton>
					</>
				) : (
					<>
						<EditRecipeButton type="button" onClick={() => setEditing(!isEditing)}>
							✏️ Edit
						</EditRecipeButton>
						<DeleteRecipeButton type="button" onClick={handleDeleteConfirmModal}>
							🗑️ Delete
						</DeleteRecipeButton>
					</>
				)}
			</ButtonGroup>
		</ModalLayout>
	);
};

const Group = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
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

const CancelButton = styled(Button)`
	background-color: var(--grey400);

	&:active,
	&:focus {
		background-color: var(--greyOpacity300);
	}
`;

const UpdateButton = styled(Button)`
	background-color: var(--blue200);

	&:active,
	&:focus {
		background-color: var(--blue300);
	}
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
