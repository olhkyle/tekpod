import { Suspense, useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { css } from '@emotion/react';
import { ErrorBoundary } from 'react-error-boundary';
import { Header, BottomNav, LayoutLoadingSpinner, ErrorFallback } from '.';
import { ModalContainer, QuickMemoDrawer, Toast } from '..';
import { useInitialScrollToTop } from '../../hooks';

const layoutCss = {
	wrapper: css`
		max-width: var(--max-app-width);
		min-width: var(--min-app-width);
		margin: 0 auto;
		background-color: var(--white);
		overflow: hidden;
	`,
	main: css`
		min-height: calc(100dvh - 2 * var(--nav-height));
		margin: var(--nav-height) 0;
		padding: var(--padding-container-mobile);
		background-color: var(--white);
	`,
};

const Layout = () => {
	const layoutRef = useRef<HTMLDivElement>(null);
	const [, setGlobalWidth] = useState<string>('');

	useInitialScrollToTop();

	useEffect(() => {
		if (layoutRef.current) {
			setGlobalWidth(`${layoutRef.current.clientWidth}px`);
		}
	}, [setGlobalWidth]);

	return (
		<ErrorBoundary FallbackComponent={ErrorFallback}>
			<Suspense fallback={<LayoutLoadingSpinner />}>
				<div id="layoutContainer" ref={layoutRef} css={layoutCss.wrapper}>
					<Header />
					<main id="layoutContents" css={layoutCss.main}>
						<Outlet />
					</main>
					<BottomNav />
					<ModalContainer />
					<QuickMemoDrawer />
				</div>
			</Suspense>
			<Toast />
		</ErrorBoundary>
	);
};

export default Layout;
