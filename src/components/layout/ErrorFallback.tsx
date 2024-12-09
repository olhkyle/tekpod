import { css } from '@emotion/react';
import { FallbackProps } from 'react-error-boundary';
import { Button } from '../common';

const layoutCss = {
	wrapper: css`
		max-width: var(--max-app-width);
		min-width: var(--min-app-width);
		margin: 0 auto;
		overflow: hidden;
	`,
	main: css`
		min-height: calc(100dvh - 2 * var(--nav-height));
		margin: var(--nav-height) 0;
		padding: var(--padding-container-mobile);
		background-color: var(--white);
	`,
};

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
	console.log(error.message);
	return (
		<div css={layoutCss.wrapper}>
			<div css={layoutCss.main}>
				<div
					css={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						minHeight: 'calc(100dvh - 2 * var(--nav-height))',
					}}>
					<div css={{ fontWeight: 'var(--fw-bold)' }}>문제가 발생하였습니다</div>
					<Button
						type="button"
						css={{ marginTop: '16px', padding: '16px', backgroundColor: 'var(--black)', color: 'var(--white)', borderRadius: '8px' }}
						onClick={() => resetErrorBoundary()}>
						다시 시도하기
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ErrorFallback;
