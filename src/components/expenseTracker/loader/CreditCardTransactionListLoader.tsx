import { SkeletonLoader } from '../../common';

const CreditCardTransactionListLoader = () => {
	return (
		<div
			css={{
				display: 'flex',
				flexDirection: 'column',
				gap: '16px',
				margin: '16px 0',
			}}>
			<SkeletonLoader width={'100%'} height={'150px'} />
			<SkeletonLoader width={'100%'} height={'150px'} />
			<SkeletonLoader width={'100%'} height={'150px'} />
			<SkeletonLoader width={'100%'} height={'150px'} />
			<SkeletonLoader width={'100%'} height={'150px'} />
		</div>
	);
};

export default CreditCardTransactionListLoader;
