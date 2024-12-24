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
				cursor: 'pointer',
			}}
			onBlur={e => {
				e.target.blur();
			}}
			{...props}>
			{children}
		</button>
	);
});

export default Button;
