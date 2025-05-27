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
			{Array.from({ length: 8 }, (_, idx) => (
				<SkeletonLoader key={idx} width={'100%'} height={'72px'} />
			))}
		</div>
	);
};

export default PaymentItemLoader;
