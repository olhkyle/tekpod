import { ChangeEvent, Children, cloneElement, ForwardedRef, forwardRef, HTMLAttributes, ReactElement, useId, useRef } from 'react';
import styled from '@emotion/styled';

interface TextAreaProps {
	children: ReactElement;
	errorMessage?: string;
}

const TextArea = ({ children, errorMessage, ...props }: TextAreaProps) => {
	const child = Children.only(children);
	const generatedId = useId();
	const id = child.props.id ?? generatedId;

	const ref = useRef<HTMLTextAreaElement | null>(null);

	return (
		<Container {...props}>
			{cloneElement(child, { id, ref, ...child.props })}
			{errorMessage && <Message>﹡ {errorMessage}</Message>}
		</Container>
	);
};

interface TextFieldProps extends Omit<HTMLAttributes<HTMLTextAreaElement>, 'size'> {
	id: string;
	name: string;
	value: string;
	onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
	placeholder: string;
}

TextArea.TextField = forwardRef(
	({ id, name, value, onChange, placeholder, ...props }: TextFieldProps, ref: ForwardedRef<HTMLTextAreaElement>) => {
		return (
			<TextField
				id={id}
				name={name}
				ref={ref}
				value={value}
				placeholder={placeholder}
				onChange={e => {
					const element = e.currentTarget;

					element.style.height = 'auto';
					element.style.height = `${element.scrollHeight}px`;

					if (onChange) {
						onChange(e);
					}
				}}
				{...props}
			/>
		);
	},
);

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
`;

const Message = styled.p`
	padding-left: 4px;
	font-size: var(--fz-sm);
	color: var(--red200);
`;

const TextField = styled.textarea`
	padding: var(--padding-container-mobile);
	font-size: var(--fz-h5);
	font-weight: var(--fw-regular);
	color: var(--black);
	border-bottom: 1px solid var(--greyOpacity100);
	border-radius: none;
	transition: border 0.15s ease-in-out;
	appearance: none;
	resize: none;
	overflow: hidden;
	cursor: pointer;

	&::placeholder {
		color: var(--grey400);
	}

	&:focus {
		border-bottom-color: var(--black);
	}
`;

export default TextArea;
