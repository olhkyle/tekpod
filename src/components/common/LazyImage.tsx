import styled from '@emotion/styled';
import { useIsImageLoaded } from '../../hooks';

const placeholderImageUrl: string = '/placeholder-gray.webp';

interface LazyImageProps {
	src: string;
	alt: string;
	width: `${number}px` | `${number}%` | '100%' | '100dvw' | 'auto';
	height: `${number}px` | `${number}%` | '100%' | '100dvh' | 'auto';
	lazy: boolean;
}

const LazyImage = ({ src, alt, width, height, lazy = true }: LazyImageProps) => {
	const { elementRef, isLoaded } = useIsImageLoaded(lazy);

	return (
		<Container>
			<img
				ref={elementRef}
				src={isLoaded ? src : placeholderImageUrl}
				alt={alt}
				style={{ display: 'block', width, height }}
				sizes="(max-width: 640px) 240px, 300px"
			/>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	object-fit: cover;
`;

export default LazyImage;
