import React from 'react';
import { Outlet } from 'react-router-dom';
import { Nav, Footer } from '.';
import { css } from '@emotion/react';
import BottomHeader from './BottomHeader';

const layoutCss = {
	wrapper: css`
		max-width: var(--max-app-width);
		min-width: var(--min-app-width);
		margin: 0 auto;
		overflow: hidden;
	`,
	main: css`
		min-height: calc(100vh - 50px);
		margin-top: 50px;
		background-color: var(--color-white);
	`,
};

const Layout = () => {
	const layoutRef = React.useRef<HTMLDivElement>(null);
	const [, setGlobalWidth] = React.useState('');

	React.useEffect(() => {
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
			<Footer />
		</div>
	);
};

export default Layout;
