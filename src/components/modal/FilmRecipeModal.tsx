import { useState } from 'react';
import styled from '@emotion/styled';
import { editRecipe } from '../../supabase/filmRecipe';
import type { RestricedRecipeWithImage } from '../../supabase/schema';
import type { ModalDataType } from './modalType';
import {
	ModalLayout,
	RemoveFilmRecipeConfirmModal,
	LazyImage,
	FilmRecipeImageUpload,
	TextInput,
	CustomSelect,
	Button,
	FilmRecipeStaticFields,
} from '..';
import useModalStore, { QueryRefetch } from '../../store/useModalStore';
import useToastStore from '../../store/useToastStore';
import { useFilmRecipeImage, useLoading } from '../../hooks';
import { fieldData, FILM_RECIPE_FORM, PLACEHOLDER_IMAGE_URL } from '../../constants/recipes';
import { validateTitle } from '../../utils/validateField';

interface FilmRecipeModalProps {
	id: string;
	type: ModalDataType;
	data: RestricedRecipeWithImage;
	refetch: QueryRefetch;
	onClose: () => void;
}

const FilmRecipeModal = ({ id, type, data, refetch, onClose }: FilmRecipeModalProps) => {
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

	const [currentFilmFeature, setCurrentFilmFeature] = useState<RestricedRecipeWithImage>(data);

	const hasChanges = () => {
		// 이미지가 변경되었는지 확인
		const isImageChanged = imageUrl !== data?.imgSrc || currentRecipeImage !== null;

		// 다른 필드들이 변경되었는지 확인
		const isFieldsChanged = Object.keys(fieldData).some(key => {
			const fieldKey = key.toLowerCase().replace(/([A-Z])/g, '_$1') as keyof typeof data;
			return currentFilmFeature[fieldKey]?.toString() !== data[fieldKey]?.toString();
		});

		return isImageChanged || isFieldsChanged;
	};

	const handleUpdateRecipe = async () => {
		const titleValidationResult = validateTitle(currentFilmFeature.title);

		if (titleValidationResult) {
			return addToast({ status: 'error', message: titleValidationResult });
		}

		try {
			// edit 할 때 이미지 변경이 없는 경우, storage에 업로드하는 로직 없이, database에 data?.imgSrc만 업로드 하는 형태
			// edit 할 때 이미지 변경이 있는 경우, addRecipe와 같이 storage에 업로드 후, database에 uploadImage.path를 추가
			await startTransition(
				editRecipe({
					type: imageUrl === data?.imgSrc && !currentRecipeImage ? 'sameImage' : 'updatedImage',
					data: {
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
				type: 'recipe',
				data,
				refetch,
				onTopLevelModalClose: onClose,
			},
		});
	};

	return (
		<ModalLayout id={id} type={type} title={data?.title} onClose={onClose}>
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
						src={
							data?.imgSrc?.includes(`${import.meta.env.VITE_SUPABASE_PROJECT_URL}/${import.meta.env.VITE_SUPABASE_FILMRECIPE_URL}`)
								? data?.imgSrc
								: PLACEHOLDER_IMAGE_URL
						}
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
					<FilmRecipeStaticFields data={data} />
				)}
			</Group>
			<ButtonGroup>
				{isEditing ? (
					<>
						<CancelButton type="button" onClick={() => setEditing(false)}>
							Cancel
						</CancelButton>
						<UpdateButton type="button" disabled={!hasChanges()} onClick={handleUpdateRecipe}>
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

const ButtonGroup = styled.div`
	display: flex;
	justify-content: space-between;
	gap: 16px;
	margin-top: calc(var(--padding-container-mobile) * 8);
`;

const StyledButton = styled(Button)`
	padding: var(--padding-container-mobile);
	width: 100%;
	min-height: 57px;
	color: var(--white);
	font-size: var(--fz-p);
	font-weight: var(--fw-semibold);
	transition: background 0.15s ease-in-out;
`;

const CancelButton = styled(StyledButton)`
	background-color: var(--grey400);

	&:active,
	&:focus {
		background-color: var(--greyOpacity300);
	}
`;

const UpdateButton = styled(StyledButton)`
	background-color: var(--blue200);

	&:active,
	&:focus {
		background-color: var(--blue300);
	}
`;

const EditRecipeButton = styled(StyledButton)`
	background-color: var(--black);

	&:active,
	&:focus {
		background-color: var(--greyOpacity900);
	}

	&:disabled {
		background-color: var(--greyOpacity400);
	}
`;

const DeleteRecipeButton = styled(StyledButton)`
	background-color: var(--grey200);
	color: var(--grey700);

	&:active,
	&:focus {
		background-color: var(--greyOpacity300);
	}
`;

export default FilmRecipeModal;
