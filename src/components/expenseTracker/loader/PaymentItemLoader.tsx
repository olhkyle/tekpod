import styled from '@emotion/styled';
import { SkeletonLoader } from '../../common';

const PaymentItemLoader = () => {
	return (
		<Container>
			<SkeletonLoader theme={'light'} width={'70%'} height={'72px'} />
			<SkeletonLoader theme={'light'} width={'70%'} height={'72px'} />
			<SkeletonLoader theme={'light'} width={'70%'} height={'72px'} />
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	margin: 16px 0;
`;

export default PaymentItemLoader;
