import { ReactNode, Suspense } from 'react';
import { css } from '@emotion/react';
import { LayoutLoadingSpinner, ModalContainer } from '..';

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
		<Suspense fallback={<LayoutLoadingSpinner />}>
			<div id="authLayout-container" css={layoutCss.container}>
				{children}
			</div>
			<ModalContainer />
		</Suspense>
	);
};

export default AuthLayout;
