import { ChangeEvent, useRef, useState } from 'react';
import { useToastStore } from '../store';
import { toastData } from '../constants';

const useFilmRecipeImage = ({ DEFAULT_IMAGE_SIZE, isEditing = false }: { DEFAULT_IMAGE_SIZE: number; isEditing: boolean }) => {
	const [imageDataUrl, setImageDataUrl] = useState<string>('');
	const [currentRecipeImage, setCurrentRecipeImage] = useState<File | null>(null);
	const imageInputRef = useRef<HTMLInputElement | null>(null);

	const { addToast } = useToastStore();

	// 편집 모드일 때와 새로운 이미지 업로드 모드일 때 다르게 처리
	const hasValidImage = () => {
		const defaultValidation = typeof imageDataUrl === 'string' && imageDataUrl.trim().length > 0;
		if (isEditing) {
			// Edit Mode : it's valid if Data URL exists
			return defaultValidation;
		} else {
			// New Image upload mode : Data URL and current Image file exists simultaneously
			return defaultValidation && currentRecipeImage !== null;
		}
	};

	const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
		const currentImageFile = e.target.files?.[0];
		const currentImageFileSize = currentImageFile?.size ?? 0;

		e.target.value = '';

		if (
			currentImageFile?.type !== 'image/webp' &&
			currentImageFile?.type !== 'image/jpeg' &&
			currentImageFile?.type !== 'image/heic' &&
			currentImageFile?.type !== 'image/png'
		) {
			if (imageInputRef?.current) {
				imageInputRef.current.value = '';
			}

			addToast(toastData.FILM_RECIPE.CREATE.IMAGE.WARN.IMAGE_TYPE);
			return;
		}

		if (!currentImageFile) {
			addToast(toastData.FILM_RECIPE.CREATE.IMAGE.WARN.NOT_UPLOADED);
			return;
		}

		if (currentImageFileSize > DEFAULT_IMAGE_SIZE) {
			addToast(toastData.FILM_RECIPE.CREATE.IMAGE.WARN.FILE_SIZE);
			return;
		}

		const readFileAsDataUrl = (file: File): Promise<string> => {
			return new Promise((resolve, reject) => {
				const fileReader = new FileReader();

				if (currentImageFile) {
					fileReader.onload = () => {
						if (typeof fileReader.result === 'string') {
							resolve(fileReader.result);
						} else {
							reject(new Error('Failed to read File as DataUrl'));
						}
					};

					fileReader.onerror = reject;
					fileReader.readAsDataURL(file);
					/**
					 * The `readAsDataURL` method returns a Base64-encoded string, so the `typeof` condition below is technically unnecessary. However, if multiple photos are uploaded instead of a single one in the future, `readAsArrayBuffer` will be used to make the FileReader result return an ArrayBuffer type. Therefore, the condition is added for future compatibility.
					 */
				}
			});
		};

		try {
			const imageUrl = await readFileAsDataUrl(currentImageFile);

			setImageDataUrl(imageUrl);
			setCurrentRecipeImage(currentImageFile);
		} catch (e) {
			addToast(toastData.FILM_RECIPE.CREATE.IMAGE.ERROR);
		}
	};

	const handleImageRemove = () => {
		setImageDataUrl('');
		setCurrentRecipeImage(null);

		if (imageInputRef?.current) {
			imageInputRef.current.value = '';
		}
	};

	return {
		image: { imageUrl: imageDataUrl, currentRecipeImage, isAttached: hasValidImage() },
		setImageUrlOnEditing: (value: string) => setImageDataUrl(value),
		handleImageUpload,
		handleImageRemove,
	};
};

export default useFilmRecipeImage;
