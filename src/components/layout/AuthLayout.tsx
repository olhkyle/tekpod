import { ReactNode, Suspense } from 'react';
import { css } from '@emotion/react';
import { ErrorBoundary } from 'react-error-boundary';
import { ModalContainer, Toast, ErrorFallback, LayoutLoadingSpinner } from '..';

interface AuthLayoutProps {
	children: ReactNode;
}

const layoutCss = {
	container: css`
		max-width: var(--max-app-width);
		min-width: var(--min-app-width);
		margin: 0 auto;
		overflow: hidden;
	`,
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
	return (
		<ErrorBoundary FallbackComponent={ErrorFallback}>
			<Suspense fallback={<LayoutLoadingSpinner />}>
				<div id="authLayout-container" css={layoutCss.container}>
					{children}
				</div>
				<Toast />
				<ModalContainer />
			</Suspense>
		</ErrorBoundary>
	);
};

export default AuthLayout;
