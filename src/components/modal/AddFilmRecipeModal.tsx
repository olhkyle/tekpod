import { FormEventHandler, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { RiCloseFill } from 'react-icons/ri';

import { Session } from '@supabase/supabase-js';
import { ModalLayout } from '.';
import { ModalDataType } from './modalType';
import useToastStore from '../../store/useToastStore';
import { CustomSelect, TextInput } from '../common';
import {
	color,
	dynamicRange,
	filmSimulation,
	grainEffect,
	highlight,
	noiseReduction,
	sensors,
	shadow,
	sharpness,
} from '../../constants/recipes';
import type { RestrictedRecipeForValidation } from '../../supabase/schema';
import { addRecipe } from '../../supabase/filmRecipe';
import { useQueryClient } from '@tanstack/react-query';
import { useLoading } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../constants';

interface AddFilmRecipeModalProps {
	id: string;
	isOpen: boolean;
	type: ModalDataType;
	onClose: () => void;
}

interface FieldUIData {
	type: 'input' | 'select';
	data?:
		| typeof filmSimulation
		| typeof dynamicRange
		| typeof grainEffect
		| typeof highlight
		| typeof shadow
		| typeof color
		| typeof sharpness
		| typeof noiseReduction
		| typeof sensors;
	target_id: keyof RestrictedRecipeForValidation;
	placeholder?: string;
}

const DEFAULT_IMAGE_SIZE = 10 * 1024 * 1024;

const initialFilmFeatureState: RestrictedRecipeForValidation = {
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
};

const initialTriggeredState: { [key: string]: boolean } = {
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

const AddFilmRecipeModal = ({ id, isOpen, type, onClose }: AddFilmRecipeModalProps) => {
	const queryClient = useQueryClient();
	const session = queryClient.getQueryData(['auth']) as Session;

	const [previousImageUrl, setPreviousImageUrl] = useState<string>('');
	const [currentRecipeImage, setCurrentRecipeImage] = useState<File | null>(null);
	const imageInputRef = useRef<HTMLInputElement | null>(null);

	const [currentFilmFeature, setCurrentFilmFeature] = useState<RestrictedRecipeForValidation>(initialFilmFeatureState);
	const [isTriggered, setTriggered] = useState(initialTriggeredState);

	const navigate = useNavigate();
	const { isLoading, Loading, startTransition } = useLoading();
	const { addToast } = useToastStore();

	const isAttatched = previousImageUrl !== '' && previousImageUrl.length !== 0 && currentRecipeImage !== null;

	const fieldUIData: FieldUIData[] = [
		{ type: 'input', target_id: 'title', placeholder: 'Recipe Title' },
		{ type: 'select', data: filmSimulation, target_id: 'film_simulation' },
		{ type: 'select', data: dynamicRange, target_id: 'dynamic_range' },
		{ type: 'select', data: grainEffect, target_id: 'grain_effect' },
		{ type: 'input', target_id: 'wb', placeholder: 'White Balance(Auto, +1 Red & +1 Blue)' },
		{ type: 'select', data: highlight, target_id: 'highlight' },
		{ type: 'select', data: shadow, target_id: 'shadow' },
		{ type: 'select', data: color, target_id: 'color' },
		{ type: 'select', data: sharpness, target_id: 'sharpness' },
		{ type: 'select', data: noiseReduction, target_id: 'noise_reduction' },
		{ type: 'input', target_id: 'iso', placeholder: 'up to ISO 6400' },
		{
			type: 'input',
			target_id: 'exposure_compensation',
			placeholder: 'Exposure Compensation',
		},
		{ type: 'select', data: sensors, target_id: 'sensors' },
	];

	const checkIsDisabled = () => {
		if (Object.values(isTriggered).every(value => value) && isAttatched) {
			return false;
		} else {
			return true;
		}
	};

	const handleAddFilmRecipe: FormEventHandler<HTMLFormElement> = async e => {
		e.preventDefault();

		const today = new Date();

		if (checkIsDisabled()) {
			return addToast({ status: 'warn', message: 'Some Fields are not filled' });
		}

		try {
			if (currentRecipeImage) {
				await startTransition(
					addRecipe({
						...currentFilmFeature,
						user_id: session?.user?.id,
						imgSrc: currentRecipeImage,
						created_at: today,
						updated_at: today,
					}),
				);

				addToast({ status: 'success', message: `Successfully Add Film-Recipe` });
				navigate(routes.FILM_RECIPE);
			}
		} catch (error) {
			console.error(error);
			addToast({ status: 'error', message: `Error happens, adding Film-Recipe` });
		} finally {
			onClose();
		}
	};

	return (
		<ModalLayout id={id} isOpen={isOpen} type={type} title={'Add Recipe'} onClose={onClose}>
			<Form onSubmit={handleAddFilmRecipe}>
				<ImageUploadInput isAttatched={isAttatched}>
					<input
						type="file"
						id="image_upload_input"
						name="image_upload_input"
						accept="image/*"
						ref={imageInputRef}
						onChange={e => {
							const currentImageFile = e.target.files?.[0];
							const currentImageFileSize = currentImageFile?.size ?? 0;

							if (currentImageFileSize > DEFAULT_IMAGE_SIZE) {
								addToast({ status: 'warn', message: 'File can not be uploaded over 10mb' });
								return;
							}

							const fileReader = new FileReader();

							if (currentImageFile) {
								fileReader.readAsDataURL(currentImageFile);

								/**
								 * readAsDataUrl 메서드의 경우 base64로 인코딩된 문자열을 반환하여, 아래 typeof 조건문은 사실상 필요 없으나,
								 * 이후 한 가지 사진이 아닌 다수의 사진을 업로드할 경우, FileReader의 result가 ArrayBuffer 타입을 반환하도록 readAsArrayBuffer을 사용할 것이므로, 아래의 조건문을 추가
								 */

								fileReader.onloadend = () => {
									if (typeof fileReader.result === 'string') {
										setPreviousImageUrl(fileReader.result);
									}
								};

								setCurrentRecipeImage(currentImageFile);
							}
						}}
					/>
					<label htmlFor="image_upload_input">+ UPLOAD IMAGE</label>
					<PreviewImage isAttatched={isAttatched}>
						<img src={previousImageUrl} alt="preview_image" />
					</PreviewImage>
					<CloseButton
						type="button"
						isAttatched={isAttatched}
						onClick={() => {
							setPreviousImageUrl('');

							if (imageInputRef?.current) {
								imageInputRef.current.value = '';
							}
						}}>
						<RiCloseFill size="24" color="var(--black)" />
					</CloseButton>
				</ImageUploadInput>

				{fieldUIData.map(({ type, data, target_id, placeholder }, idx) => {
					return type === 'input' ? (
						<TextInput aria-label={target_id} key={`${type}_${idx}`}>
							<TextInput.ControlledTextField
								id={target_id}
								name={target_id}
								placeholder={placeholder!}
								value={currentFilmFeature[target_id].toString()}
								onChange={e => {
									setCurrentFilmFeature({ ...currentFilmFeature, [target_id]: e.target.value });
									setTriggered({ ...isTriggered, [target_id]: e.target.value.length > 1 });
								}}
							/>
						</TextInput>
					) : (
						<CustomSelect
							key={`${type}_${idx}`}
							data={data!}
							target_id={target_id}
							current={currentFilmFeature}
							setCurrent={setCurrentFilmFeature}
							isTriggered={isTriggered}
							setTriggered={setTriggered}
						/>
					);
				})}

				<AddRecipeButton type="submit" disabled={checkIsDisabled()}>
					{isLoading ? Loading : 'ADD RECIPE'}
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

const ImageUploadInput = styled.div<{ isAttatched: boolean }>`
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 16px;
	width: 100%;
	font-size: var(--fz-h7);
	font-weight: var(--fw-semibold);
	background: ${({ isAttatched }) =>
		isAttatched ? 'var(--white)' : 'linear-gradient(90deg, var(--greyOpacity100), var(--greyOpacity200))'};
	border: 1px solid var(--greyOpacity200);
	cursor: pointer;

	input {
		display: none;
	}

	label {
		display: ${({ isAttatched }) => (isAttatched ? 'none' : 'inline-flex')};
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		min-height: 300px;
		text-align: center;
		vertical-align: center;
	}
`;

const PreviewImage = styled.div<{ isAttatched: boolean }>`
	display: ${({ isAttatched }) => (isAttatched ? 'flex' : 'none')};
	justify-content: center;
	align-items: center;
	object-fit: cover;

	img {
		display: block;
		width: 100%;
		max-height: 300px;
	}
`;

const CloseButton = styled.button<{ isAttatched: boolean }>`
	position: absolute;
	top: -12px;
	right: 0;
	display: ${({ isAttatched }) => (isAttatched ? 'inline-flex' : 'none')};
	justify-content: center;
	align-items: center;
	width: 24px;
	height: 24px;
	background-color: var(--white);
	border: 1px solid var(--black);
`;

const AddRecipeButton = styled.button`
	margin-top: 32px;
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

export default AddFilmRecipeModal;
