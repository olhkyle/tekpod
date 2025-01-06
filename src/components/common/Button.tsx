import { ButtonHTMLAttributes, ForwardedRef, forwardRef, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	type: 'button' | 'submit';
	children: ReactNode;
}

const Button = forwardRef(({ type, children, ...props }: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) => {
	return (
		<button
			type={type}
			ref={ref}
			css={{
				borderRadius: 'var(--radius-s)',
				cursor: 'pointer',
				transition: 'background 0.15s ease-in-out',
			}}
			onBlur={e => e.target.blur()}
			{...props}>
			{children}
		</button>
	);
});

export default Button;
