import { FormEventHandler, useState } from 'react';
import styled from '@emotion/styled';
import { Session } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import type { ModalDataType } from '../modalType';
import { FilmRecipeImageUpload, LoadingSpinner, CustomSelect, TextInput, ModalLayout, Button } from '../..';
import useToastStore from '../../../store/useToastStore';
import { useFilmRecipeImage, useAddFilmRecipeMutation } from '../../../hooks';
import { FILM_RECIPE_FORM } from '../../../constants/recipes';
import type { RestrictedRecipeForValidation } from '../../../supabase/schema';
import { toastData } from '../../../constants/toast';

interface AddFilmRecipeModalProps {
	id: string;
	type: ModalDataType;
	onClose: () => void;
}

const initialFilmFieldValue: Omit<RestrictedRecipeForValidation, 'imgSrc'> = {
	title: '',
	film_simulation: 'Provia',
	dynamic_range: 'DR-Auto',
	grain_effect: 'Weak',
	wb: 'Auto, 0 Red & 0 Blue',
	highlight: 0,
	shadow: 0,
	color: 0,
	sharpness: 0,
	noise_reduction: 0,
	iso: 'up to ISO 6400',
	exposure_compensation: '0 to +1',
	sensors: 'X-Trans III',
	primary: false,
};

const initialValidationState: { [key: string]: boolean } = {
	title: false,
	film_simulation: false,
	dynamic_range: false,
	grain_effect: false,
	wb: true,
	highlight: false,
	shadow: false,
	color: false,
	sharpness: false,
	noise_reduction: false,
	iso: true,
	exposure_compensation: true,
	sensors: false,
};

const AddFilmRecipeModal = ({ id, type, onClose }: AddFilmRecipeModalProps) => {
	const queryClient = useQueryClient();
	const session = queryClient.getQueryData(['auth']) as Session;

	const [currentFilmFeature, setCurrentFilmFeature] = useState<Omit<RestrictedRecipeForValidation, 'imgSrc'>>(initialFilmFieldValue);
	const [isTriggered, setTriggered] = useState(initialValidationState);

	const { mutate: addFilmRecipe, isPending } = useAddFilmRecipeMutation({ handlers: { onClose } });
	const { addToast } = useToastStore();

	const {
		image: { imageUrl, currentRecipeImage, isAttached },
		handleImageUpload,
		handleImageRemove,
	} = useFilmRecipeImage({ DEFAULT_IMAGE_SIZE: FILM_RECIPE_FORM.IMAGE.MAX_SIZE, isEditing: false });

	const checkIsDisabled = () => {
		if (Object.values(isTriggered).every(value => value) && isAttached) {
			return false;
		} else {
			return true;
		}
	};

	const handleAddFilmRecipe: FormEventHandler<HTMLFormElement> = e => {
		e.preventDefault();

		const today = new Date();

		if (checkIsDisabled()) {
			addToast(toastData.FILM_RECIPE.CREATE.SUBMIT.WARN);
			return;
		}

		if (currentRecipeImage) {
			addFilmRecipe({
				data: {
					...currentFilmFeature,
					user_id: session?.user?.id,
					created_at: today,
					updated_at: today,
				},
				imageFile: currentRecipeImage,
			});
		}
	};

	return (
		<ModalLayout id={id} type={type} title={'Add Recipe'} onClose={onClose}>
			<Form onSubmit={handleAddFilmRecipe}>
				<FilmRecipeImageUpload
					imageUrl={imageUrl}
					isAttached={isAttached}
					onImageUpload={handleImageUpload}
					onImageRemove={handleImageRemove}
				/>

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
									setTriggered({ ...isTriggered, [target_id]: e.target.value.length > 1 });
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
							isTriggered={isTriggered[target_id]}
							onSelect={(option: string | number) => {
								setCurrentFilmFeature({ ...currentFilmFeature, [target_id]: option });
								setTriggered({ ...isTriggered, [target_id]: true });
							}}
						/>
					) : null;
				})}

				<AddRecipeButton type="submit" disabled={checkIsDisabled()}>
					{isPending ? <LoadingSpinner /> : 'Add'}
				</AddRecipeButton>
			</Form>
		</ModalLayout>
	);
};

const Form = styled.form`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

const AddRecipeButton = styled(Button)`
	margin-top: 32px;
	padding: var(--padding-container-mobile);
	width: 100%;
	min-height: 57px;
	color: var(--white);
	background-color: var(--black);
	font-size: var(--fz-p);
	font-weight: var(--fw-semibold);

	&:active,
	&:focus {
		background-color: var(--greyOpacity900);
	}

	&:disabled {
		background-color: var(--greyOpacity300);
	}
`;

export default AddFilmRecipeModal;
