import { css } from '@emotion/react';

import { useNavigate } from 'react-router-dom';
import { routes } from '../constants';
import { useEffect, useRef, useState } from 'react';

const layoutCss = {
	wrapper: css`
		max-width: var(--max-app-width);
		min-width: var(--min-app-width);
		margin: 0 auto;
		height: 100dvh;
		overflow: hidden;
	`,
	container: css`
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 8px;
		padding: var(--padding-container-mobile);
		height: 100%;
		background-color: var(--white);
	`,
	title: css`
		font-size: var(--fz-h5);
		font-weight: var(--fw-black);
	`,
	description: css`
		padding: var(--padding-container-mobile);
		font-weight: var(--fw-semibold);
		color: var(--blue200);
		background-color: var(--blue100);
		border-radius: var(--radius-s);
		text-align: center;
	`,
	button: css`
		margin-top: 16px;
		padding: var(--padding-container-mobile);
		font-weight: var(--fw-bold);
		color: var(--white);
		background-color: var(--black);
		border: 1px solid var(--greyOpacity200);
		border-radius: var(--radius-s);
		transition: background 0.15s ease-in-out;

		&:hover {
			background-color: var(--greyOpacity900);
		}
	`,
};

const NotFound = () => {
	const navigate = useNavigate();

	const layoutRef = useRef<HTMLDivElement>(null);
	const [, setGlobalWidth] = useState('');

	useEffect(() => {
		if (layoutRef.current) {
			setGlobalWidth(`${layoutRef.current.clientWidth}px`);
		}
	}, [setGlobalWidth]);

	return (
		<div ref={layoutRef} css={layoutCss.wrapper}>
			<div css={layoutCss.container}>
				<h1 css={layoutCss.title}>TEKT</h1>
				<p css={layoutCss.description}>🌪️ Something went wrong</p>
				<button type="button" css={layoutCss.button} onClick={() => navigate(routes.HOME)}>
					Go Back to 🏠
				</button>
			</div>
		</div>
	);
};

export default NotFound;
