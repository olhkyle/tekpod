import styled from '@emotion/styled';
import { SkeletonLoader } from '../common';

const FilmRecipeContentLoader = () => {
	return (
		<Container>
			<SkeletonLoader width={'60%'} height={'32px'} />
			<SkeletonLoader width={'60%'} height={'32px'} />
			<SkeletonLoader width={'60%'} height={'32px'} />
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	margin-top: 32px;
`;

export default FilmRecipeContentLoader;
