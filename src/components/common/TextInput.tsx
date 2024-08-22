import { Children, cloneElement, ForwardedRef, forwardRef, HTMLAttributes, ReactElement, useId } from 'react';
import styled from '@emotion/styled';

interface TextInputProps extends Omit<HTMLAttributes<HTMLInputElement>, 'size'> {
	children: ReactElement;
	errorMessage?: string;
}

const TextInput = ({ children, errorMessage, ...props }: TextInputProps) => {
	const child = Children.only(children);
	const generatedId = useId();
	const id = child.props.id ?? generatedId;

	return (
		<Container {...props}>
			{cloneElement(child, {
				id,
				...child.props,
			})}
			{errorMessage && <Message>﹡ {errorMessage}</Message>}
		</Container>
	);
};

interface TextFieldProps extends Omit<HTMLAttributes<HTMLInputElement>, 'size'> {
	id: string;
	name: string;
	placeholder: string;
}

TextInput.TextField = forwardRef(({ name, id, placeholder, ...props }: TextFieldProps, ref: ForwardedRef<HTMLInputElement>) => {
	return <Input type="text" id={id} name={name} placeholder={placeholder} ref={ref} {...props} />;
});

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

const Message = styled.p`
	padding-left: 4px;
	font-size: var(--fz-sm);
	color: var(--red200);
`;

const Input = styled.input<{ name: string }>`
	padding: var(--padding-container-mobile);
	font-size: var(--fz-h5);
	font-weight: ${({ name }) => (name === 'title' ? 'var(--fw-semibold)' : 'var(--fw-regular)')};
	color: var(--black);
	border-bottom: 1px solid var(--greyOpacity100);
	border-radius: none;
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
