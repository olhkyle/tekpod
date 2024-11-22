import { ChangeEvent, forwardRef } from 'react';
import styled from '@emotion/styled';
import { RiCloseFill } from 'react-icons/ri';

interface FilmRecipeImageUploadProps {
	imageUrl: string;
	isAttached: boolean;
	onImageUpload: (e: ChangeEvent<HTMLInputElement>) => void;
	onImageRemove: () => void;
}

const FilmRecipeImageUpload = forwardRef<HTMLInputElement, FilmRecipeImageUploadProps>(
	({ imageUrl, isAttached, onImageUpload, onImageRemove }, ref) => {
		return (
			<ImageUploadInput isAttached={isAttached}>
				<input type="file" id="image_upload_input" name="image_upload_input" accept="image/*" ref={ref} onChange={onImageUpload} />
				<label htmlFor="image_upload_input">+ UPLOAD IMAGE</label>
				<PreviewImage isAttached={isAttached}>
					<img src={imageUrl} alt="preview_image" />
				</PreviewImage>
				<CloseButton type="button" isAttached={isAttached} onClick={onImageRemove}>
					<RiCloseFill size="24" color="var(--black)" />
				</CloseButton>
			</ImageUploadInput>
		);
	},
);

const ImageUploadInput = styled.div<{ isAttached: boolean }>`
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 16px;
	width: 100%;
	font-size: var(--fz-h7);
	font-weight: var(--fw-semibold);
	background: ${({ isAttached }) => (isAttached ? 'var(--white)' : 'linear-gradient(90deg, var(--greyOpacity100), var(--greyOpacity200))')};
	border: 1px solid var(--greyOpacity200);
	cursor: pointer;

	input {
		display: none;
	}

	label {
		display: ${({ isAttached }) => (isAttached ? 'none' : 'inline-flex')};
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		min-height: 300px;
		text-align: center;
		vertical-align: center;
	}
`;

const PreviewImage = styled.div<{ isAttached: boolean }>`
	display: ${({ isAttached }) => (isAttached ? 'flex' : 'none')};
	justify-content: center;
	align-items: center;
	object-fit: cover;

	img {
		display: block;
		width: 100%;
		max-height: 300px;
	}
`;

const CloseButton = styled.button<{ isAttached: boolean }>`
	position: absolute;
	top: -12px;
	right: 0;
	display: ${({ isAttached }) => (isAttached ? 'inline-flex' : 'none')};
	justify-content: center;
	align-items: center;
	width: 24px;
	height: 24px;
	background-color: var(--white);
	border: 1px solid var(--black);
`;

export default FilmRecipeImageUpload;
