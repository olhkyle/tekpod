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
			// 편집 모드: 데이터 URL이 존재하면 유효
			return defaultValidation;
		} else {
			// 새로운 이미지 업로드 모드: 데이터 URL과 현재 이미지 파일 모두 존재
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
					 * readAsDataUrl 메서드의 경우 base64로 인코딩된 문자열을 반환하여, 아래 typeof 조건문은 사실 상 필요 없으나,
					 * 이후 한 가지 사진이 아닌 다수의 사진을 업로드할 경우, FileReader의 result가 ArrayBuffer 타입을 반환하도록 readAsArrayBuffer을 사용할 것이므로, 아래의 조건문을 추가
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
