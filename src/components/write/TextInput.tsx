import styled from '@emotion/styled';
import { ForwardedRef, forwardRef, HTMLAttributes } from 'react';

interface TextInputProps extends Omit<HTMLAttributes<HTMLInputElement>, 'size'> {
	id: string;
	name: string;
	placeholder: string;
}

const TextInput = forwardRef(({ name, id, placeholder, ...props }: TextInputProps, ref: ForwardedRef<HTMLInputElement>) => {
	return <Input type="text" id={id} name={name} placeholder={placeholder} ref={ref} {...props} />;
});

const Input = styled.input<{ name: string }>`
	padding: var(--padding-container-mobile);
	font-size: var(--fz-h5);
	font-weight: ${({ name }) => (name === 'title' ? 'var(--fw-semibold)' : 'var(--fw-regular)')};
	color: var(--black);
	border-bottom: 1px solid var(--greyOpacity100);
	transition: border 0.15s ease-in-out;
	cursor: pointer;

	&::placeholder {
		color: ${({ name }) => (name === 'feeling' ? 'var(--grey300)' : 'var(--grey400)')};
	}

	&:focus {
		border-bottom-color: var(--black);
	}
`;

export default TextInput;
