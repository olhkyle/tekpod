import { ButtonHTMLAttributes, ForwardedRef, forwardRef, ReactNode } from 'react';
import styled from '@emotion/styled';
import { Button } from '.';

interface FloatingActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	type?: 'button' | 'submit';
	variant: 'button' | 'link';
	children: ReactNode;
}

const FloatingActionButton = forwardRef(
	({ type = 'button', variant, children, ...props }: FloatingActionButtonProps, ref: ForwardedRef<HTMLButtonElement>) => {
		return (
			<>
				{variant === 'link' ? (
					<LinkWrapper aria-label="floating-action-link-wrapper">{children}</LinkWrapper>
				) : (
					<StyledButton type={type} ref={ref} {...props}>
						{children}
					</StyledButton>
				)}
			</>
		);
	},
);

const LinkWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;

	a {
		position: fixed;
		bottom: calc(var(--nav-height) + 2 * var(--padding-container-mobile));
		left: 0;
		right: 0;
		margin: 0 auto;
		padding: var(--padding-container-mobile);
		max-width: calc(var(--max-app-width) - 2 * var(--padding-container-mobile));
		width: calc(100% - var(--padding-container-mobile) * 2);
		border-radius: var(--radius-s);
		transition: background-color 0.3s ease-in-out;
		z-index: var(--floating-action-button-index);

		@media screen and (min-width: 640px) {
			bottom: calc(var(--nav-height) + var(--padding-container-mobile));
			width: calc(var(--max-app-width) - 2 * var(--padding-container-mobile));
		}
	}
`;

const StyledButton = styled(Button)`
	position: fixed;
	bottom: calc(var(--nav-height) + 2 * var(--padding-container-mobile));
	left: 0;
	right: 0;
	margin: 0 auto;
	padding: var(--padding-container-mobile);
	max-width: calc(var(--max-app-width) - 2 * var(--padding-container-mobile));
	width: calc(100% - var(--padding-container-mobile) * 2);
	z-index: var(--floating-action-button-index);

	@media screen and (min-width: 640px) {
		bottom: calc(var(--nav-height) + var(--padding-container-mobile));
		width: calc(var(--max-app-width) - 2 * var(--padding-container-mobile));
	}
`;

export default FloatingActionButton;
