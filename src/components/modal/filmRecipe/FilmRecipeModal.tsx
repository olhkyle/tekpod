import { useState } from 'react';
import styled from '@emotion/styled';
import { FaStar } from 'react-icons/fa';
import { FaRegStar } from 'react-icons/fa6';
import { editRecipe } from '../../../supabase/filmRecipe';
import type { RestricedRecipeWithImage } from '../../../supabase/schema';
import { MODAL_CONFIG, type ModalDataType } from '../modalType';
import { ModalLayout, LazyImage, FilmRecipeImageUpload, TextInput, CustomSelect, Button, FilmRecipeStaticFields } from '../..';
import useModalStore, { QueryRefetch } from '../../../store/useModalStore';
import useToastStore from '../../../store/useToastStore';
import { useFilmRecipeImage, useLoading } from '../../../hooks';
import { filmRecipeFieldData, FILM_RECIPE_FORM, PLACEHOLDER_IMAGE_URL } from '../../../constants/recipes';
import { validateTitle } from '../../../utils/validateField';
import { useQueryClient } from '@tanstack/react-query';
import queryKey from '../../../constants/queryKey';
import { toastData } from '../../../constants/toast';
import { today } from '../../../utils/date';

interface FilmRecipeModalProps {
	id: string;
	type: ModalDataType;
	data: RestricedRecipeWithImage;
	refetch: QueryRefetch;
	onClose: () => void;
}

const FilmRecipeModal = ({ id, type, data, onClose }: FilmRecipeModalProps) => {
	const queryClient = useQueryClient();
	const { setModal } = useModalStore();

	const [isEditing, setEditing] = useState<boolean>(false);
	const [isPrimary, setIsPrimary] = useState<boolean>(data?.primary);

	const {
		image: { imageUrl, currentRecipeImage, isAttached },
		setImageUrlOnEditing,
		handleImageUpload,
		handleImageRemove,
	} = useFilmRecipeImage({ DEFAULT_IMAGE_SIZE: FILM_RECIPE_FORM.IMAGE.MAX_SIZE, isEditing });

	const { startTransition, Loading, isLoading } = useLoading();
	const { addToast } = useToastStore();

	const [currentFilmFeature, setCurrentFilmFeature] = useState<RestricedRecipeWithImage>(data);

	const hasChanges = () => {
		// 이미지가 변경되었는지 확인
		const isFilmRecipePrimaryChanged = isPrimary !== data?.primary;
		const isImageChanged = imageUrl !== data?.imgSrc || currentRecipeImage !== null;

		// 다른 필드들이 변경되었는지 확인
		const isFieldsChanged = Object.keys(filmRecipeFieldData).some(key => {
			const fieldKey = key.toLowerCase().replace(/([A-Z])/g, '_$1') as keyof typeof data;
			return currentFilmFeature[fieldKey]?.toString() !== data[fieldKey]?.toString();
		});

		return isFilmRecipePrimaryChanged || isImageChanged || isFieldsChanged;
	};

	const handleUpdateRecipe = async () => {
		const titleValidationResult = validateTitle(currentFilmFeature.title);

		if (titleValidationResult) {
			return addToast(toastData.FILM_RECIPE.EDIT.ERROR.TITLE_REQUIRED(titleValidationResult));
		}

		try {
			// edit 할 때 이미지 변경이 없는 경우, storage에 업로드하는 로직 없이, database에 data?.imgSrc만 업로드 하는 형태
			// edit 할 때 이미지 변경이 있는 경우, addRecipe와 같이 storage에 업로드 후, database에 uploadImage.path를 추가
			await startTransition(
				editRecipe({
					type: imageUrl === data?.imgSrc && !currentRecipeImage ? 'sameImage' : 'updatedImage',
					data: {
						...currentFilmFeature,
						updated_at: today,
						imgSrc: imageUrl === data?.imgSrc && !currentRecipeImage ? data?.imgSrc : '',
						primary: isPrimary,
					},
					imageFile: currentRecipeImage,
				}),
			);

			addToast(toastData.FILM_RECIPE.EDIT.SUCCESS);
			onClose();
		} catch (e) {
			console.error(e);
			addToast(toastData.FILM_RECIPE.EDIT.ERROR.SUBMIT);
		} finally {
			queryClient.invalidateQueries({ queryKey: queryKey.FILM_RECIPE });
		}
	};

	const handleDeleteConfirmModal = () => {
		setModal({
			Component: MODAL_CONFIG.FILM_RECIPE.REMOVE.Component,
			props: {
				type: MODAL_CONFIG.FILM_RECIPE.REMOVE.type,
				data,
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
									onSelect={option => {
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
						<Left>
							<RankActivateButton type="button" onClick={() => setIsPrimary(!isPrimary)}>
								{isPrimary ? <FaStar size="27" color="var(--blue200)" /> : <FaRegStar size="27" color="var(--blue200)" />}
							</RankActivateButton>
							<CancelButton type="button" onClick={() => setEditing(false)}>
								Cancel
							</CancelButton>
						</Left>
						<UpdateButton type="button" disabled={!hasChanges()} onClick={handleUpdateRecipe}>
							{isLoading ? Loading : 'Update'}
						</UpdateButton>
					</>
				) : (
					<>
						<DeleteRecipeButton type="button" onClick={handleDeleteConfirmModal}>
							Delete
						</DeleteRecipeButton>
						<EditRecipeButton type="button" onClick={() => setEditing(!isEditing)}>
							Edit
						</EditRecipeButton>
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

const Left = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 16px;
`;

const RankActivateButton = styled(Button)`
	padding: calc(var(--padding-container-mobile) * 0.5) var(--padding-container-mobile);
	background-color: var(--blue100);
`;

const StyledButton = styled(Button)`
	padding: var(--padding-container-mobile);
	width: 100%;

	color: var(--white);
	font-size: var(--fz-p);
	font-weight: var(--fw-semibold);
`;

const CancelButton = styled(StyledButton)`
	background-color: var(--grey300);

	&:active,
	&:focus {
		background-color: var(--greyOpacity200);
	}
`;

const UpdateButton = styled(StyledButton)`
	background-color: var(--blue200);

	&:active,
	&:focus {
		background-color: var(--blue300);
	}

	&:disabled {
		background-color: var(--greyOpacity300);
	}
`;

const EditRecipeButton = styled(StyledButton)`
	width: 70%;
	background-color: var(--black);

	&:active,
	&:focus {
		background-color: var(--greyOpacity900);
	}
`;

const DeleteRecipeButton = styled(StyledButton)`
	width: 30%;
	background-color: var(--grey200);
	color: var(--grey700);

	&:active,
	&:focus {
		background-color: var(--greyOpacity300);
	}
`;

export default FilmRecipeModal;
