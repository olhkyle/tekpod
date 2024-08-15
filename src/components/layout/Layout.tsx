import { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { css } from '@emotion/react';
import { Nav, BottomHeader } from '.';

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
		padding: var(--padding-container-mobile);
		background-color: var(--white);
	`,
};

const Layout = () => {
	const layoutRef = useRef<HTMLDivElement>(null);
	const [, setGlobalWidth] = useState('');

	useEffect(() => {
		if (layoutRef.current) {
			setGlobalWidth(`${layoutRef.current.clientWidth}px`);
		}
	}, [setGlobalWidth]);

	return (
		<div ref={layoutRef} css={layoutCss.wrapper}>
			<Nav />
			<main css={layoutCss.main}>
				<Outlet />
			</main>
			<BottomHeader />
			{/* <Footer /> */}
		</div>
	);
};

export default Layout;
