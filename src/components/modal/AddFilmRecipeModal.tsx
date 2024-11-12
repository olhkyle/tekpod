import { useRef, useState } from 'react';
import styled from '@emotion/styled';
import { RiCloseFill } from 'react-icons/ri';
import { ModalLayout } from '.';
import { ModalDataType } from './modalType';
import useToastStore from '../../store/useToastStore';
import { NativeSelect, TextInput } from '../common';
import { dynamicRange, filmSimulation, grainEffect, sensors } from '../../constants/recipes';
import { RestrictedRecipe } from '../../supabase/schema';

interface AddFilmRecipeModalProps {
	id: string;
	isOpen: boolean;
	type: ModalDataType;
	onClose: () => void;
}

const DEFAULT_IMAGE_SIZE = 10 * 1024 * 1024;

const AddFilmRecipeModal = ({ id, isOpen, type, onClose }: AddFilmRecipeModalProps) => {
	const [previousImageUrl, setPreviousImageUrl] = useState<string>('');
	const imageInputRef = useRef<HTMLInputElement | null>(null);

	const [currentFilmFeature, setCurrentFilmFeature] = useState<Omit<RestrictedRecipe, 'id' | 'user_id' | 'created_at' | 'updated_at'>>({
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
		exposure_compensation: '0',
		sensors: 'X-Trans III',
	});

	const { addToast } = useToastStore();

	const isUploaded = previousImageUrl !== '' && previousImageUrl.length !== 0;

	return (
		<ModalLayout id={id} isOpen={isOpen} type={type} title={'Add Recipe'} onClose={onClose}>
			<Form>
				<ImageUploadInput isUploaded={isUploaded}>
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
							}
						}}
					/>
					<label htmlFor="image_upload_input">+ UPLOAD IMAGE</label>
					<PreviewImage isUploaded={isUploaded}>
						<img src={previousImageUrl} alt="preview_image" />
					</PreviewImage>
					<CloseButton
						type="button"
						isUploaded={isUploaded}
						onClick={() => {
							setPreviousImageUrl('');

							if (imageInputRef?.current) {
								imageInputRef.current.value = '';
							}
						}}>
						<RiCloseFill size="24" color="var(--black)" />
					</CloseButton>
				</ImageUploadInput>

				<TextInput>
					<TextInput.TextField id="recipe_title" name="recipe_title" placeholder="Recipe Title" />
				</TextInput>
				<NativeSelect data={filmSimulation} target_id={'film_simulation'} current={currentFilmFeature} setCurrent={setCurrentFilmFeature} />
				<NativeSelect data={dynamicRange} target_id={'dynamic_range'} current={currentFilmFeature} setCurrent={setCurrentFilmFeature} />
				<NativeSelect data={grainEffect} target_id={'grain_effect'} current={currentFilmFeature} setCurrent={setCurrentFilmFeature} />
				<TextInput>
					<TextInput.TextField id="wb" name="wb" placeholder="White Balance(Auto, +1 Red & +1 Blue)" />
				</TextInput>
				<TextInput>
					<TextInput.TextField id="highlight" name="highlight" placeholder="Highlight" />
				</TextInput>
				<TextInput>
					<TextInput.TextField id="shadow" name="shadow" placeholder="Shadow" />
				</TextInput>
				<TextInput>
					<TextInput.TextField id="color" name="color" placeholder="Color" />
				</TextInput>
				<TextInput>
					<TextInput.TextField id="sharpness" name="sharpness" placeholder="Sharpness" />
				</TextInput>
				<TextInput>
					<TextInput.TextField id="noise_reduction" name="noise_reduction" placeholder="Noise Reduction" />
				</TextInput>
				<TextInput>
					<TextInput.TextField id="iso" name="iso" placeholder="up to ISO 6400" />
				</TextInput>
				<TextInput>
					<TextInput.TextField id="exposure_compensation" name="exposure_compensation" placeholder="Exposure Compensation" />
				</TextInput>
				<NativeSelect data={sensors} target_id={'sensors'} current={currentFilmFeature} setCurrent={setCurrentFilmFeature} />

				<AddRecipeButton type="submit">ADD RECIPE</AddRecipeButton>
			</Form>
		</ModalLayout>
	);
};

const Form = styled.form`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

const ImageUploadInput = styled.div<{ isUploaded: boolean }>`
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 16px;
	width: 100%;
	font-size: var(--fz-h7);
	font-weight: var(--fw-semibold);
	background: ${({ isUploaded }) => (isUploaded ? 'var(--white)' : 'linear-gradient(90deg, var(--greyOpacity100), var(--greyOpacity200))')};
	border: 1px solid var(--greyOpacity200);
	cursor: pointer;

	input {
		display: none;
	}

	label {
		display: ${({ isUploaded }) => (isUploaded ? 'none' : 'inline-flex')};
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		min-height: 300px;
		text-align: center;
		vertical-align: center;
	}
`;

const PreviewImage = styled.div<{ isUploaded: boolean }>`
	display: ${({ isUploaded }) => (isUploaded ? 'flex' : 'none')};
	justify-content: center;
	align-items: center;
	object-fit: cover;

	img {
		display: block;
		width: 100%;
		max-height: 300px;
	}
`;

const CloseButton = styled.button<{ isUploaded: boolean }>`
	position: absolute;
	top: -12px;
	right: 0;
	display: ${({ isUploaded }) => (isUploaded ? 'inline-flex' : 'none')};
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
`;

export default AddFilmRecipeModal;
