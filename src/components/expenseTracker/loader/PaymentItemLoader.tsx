import { SkeletonLoader } from '../../common';

const PaymentItemLoader = () => {
	return (
		<div
			css={{
				display: 'flex',
				flexDirection: 'column',
				gap: '16px',
				margin: '16px 0',
			}}>
			<SkeletonLoader width={'100%'} height={'72px'} />
			<SkeletonLoader width={'100%'} height={'72px'} />
			<SkeletonLoader width={'100%'} height={'72px'} />
		</div>
	);
};

export default PaymentItemLoader;
