import styled from '@emotion/styled';
import placeholderImage from '../../assets/placeholder-gray.webp';
import { suspendImage } from '../../utils';

interface LazyImageProps {
	src: string;
	alt: string;
	width: `${number}px` | `${number}%` | '100%' | '100dvw' | 'auto';
	height: `${number}px` | `${number}%` | '100%' | '100dvh' | 'auto';
	lazy: boolean;
}

const LazyImage = ({ src, alt, width, height, lazy = true }: LazyImageProps) => {
	if (lazy && src) {
		suspendImage(src);
	}

	return (
		<Container>
			<img
				// ref={elementRef}
				src={src || placeholderImage}
				alt={alt}
				style={{ display: 'block', width, height }}
				sizes="(max-width: 640px) 300px, 380px"
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
