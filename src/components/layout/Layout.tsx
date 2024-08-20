import { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { css } from '@emotion/react';
import { Header, BottomNav } from '.';
import useInitialScrollToTop from '../../hooks/useInitialScrollToTop';

const layoutCss = {
	wrapper: css`
		max-width: var(--max-app-width);
		min-width: var(--min-app-width);
		margin: 0 auto;
		overflow: hidden;
	`,
	main: css`
		min-height: calc(100dvh - var(--nav-height));
		margin-top: var(--nav-height);
		margin-bottom: var(--nav-height);
		padding: var(--padding-container-mobile);
		background-color: var(--white);
	`,
};

const Layout = () => {
	const layoutRef = useRef<HTMLDivElement>(null);
	const [, setGlobalWidth] = useState('');

	useInitialScrollToTop();

	useEffect(() => {
		if (layoutRef.current) {
			setGlobalWidth(`${layoutRef.current.clientWidth}px`);
		}
	}, [setGlobalWidth]);

	return (
		<div ref={layoutRef} css={layoutCss.wrapper}>
			<Header />
			<main css={layoutCss.main}>
				<Outlet />
			</main>
			<BottomNav />
			{/* <Footer /> */}
		</div>
	);
};

export default Layout;
