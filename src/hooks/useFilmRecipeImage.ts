import { ChangeEvent, useRef, useState } from 'react';
import useToastStore from '../store/useToastStore';

const useFilmRecipeImage = (DEFAULT_IMAGE_SIZE: number) => {
	const [imageDataUrl, setImageDataUrl] = useState<string>('');
	const [currentRecipeImage, setCurrentRecipeImage] = useState<File | null>(null);
	const imageInputRef = useRef<HTMLInputElement | null>(null);

	const { addToast } = useToastStore();

	const isAttached = typeof imageDataUrl === 'string' && imageDataUrl.trim().length > 0 && currentRecipeImage !== null;

	const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
		const currentImageFile = e.target.files?.[0];
		const currentImageFileSize = currentImageFile?.size ?? 0;

		if (currentImageFile?.type !== 'image/webp') {
			if (imageInputRef?.current) {
				imageInputRef.current.value = '';
			}

			return addToast({ status: 'warn', message: `'image/webp' type can be uploaded only` });
		}

		if (currentImageFileSize > DEFAULT_IMAGE_SIZE) {
			addToast({ status: 'warn', message: 'File can not be uploaded over 10mb' });
			return;
		}

		const fileReader = new FileReader();

		if (currentImageFile) {
			fileReader.readAsDataURL(currentImageFile);

			/**
			 * readAsDataUrl 메서드의 경우 base64로 인코딩된 문자열을 반환하여, 아래 typeof 조건문은 사실 상 필요 없으나,
			 * 이후 한 가지 사진이 아닌 다수의 사진을 업로드할 경우, FileReader의 result가 ArrayBuffer 타입을 반환하도록 readAsArrayBuffer을 사용할 것이므로, 아래의 조건문을 추가
			 */

			fileReader.onloadend = () => {
				if (typeof fileReader.result === 'string') {
					setImageDataUrl(fileReader.result);
				}
			};

			setCurrentRecipeImage(currentImageFile);
		}
	};

	const handleImageRemove = () => {
		setImageDataUrl('');

		if (imageInputRef?.current) {
			imageInputRef.current.value = '';
		}
	};

	return {
		image: { imageUrl: imageDataUrl, currentRecipeImage, isAttached },
		handleImageUpload,
		handleImageRemove,
	};
};

export default useFilmRecipeImage;
