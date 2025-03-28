import styled from '@emotion/styled';
import eclipseHalfSvg from '../../../assets/eclipse-half.svg';

const LayoutLoadingSpinner = () => {
	return (
		<Container>
			<img src={eclipseHalfSvg} alt="spinner" />
		</Container>
	);
};

const Container = styled.div`
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100dvw;
	height: 100dvh;

	img {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate3d(-50%, -50%, 0);
		z-index: 999;
	}
`;

export default LayoutLoadingSpinner;
