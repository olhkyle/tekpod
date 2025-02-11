import styled from '@emotion/styled';
import { SkeletonLoader } from '../common';

const PaymentItemLoader = () => {
	return (
		<Container>
			<Flex>
				<SkeletonLoader width={'30%'} height={'32px'} />
			</Flex>
			<SkeletonLoader width={'60%'} height={'72px'} />
			<SkeletonLoader width={'60%'} height={'72px'} />
			<SkeletonLoader width={'60%'} height={'72px'} />
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	margin: 0 0 16px 0;
`;

const Flex = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	width: 100%;
`;

export default PaymentItemLoader;
