import styled from '@emotion/styled';
import { ChangeEvent, HTMLAttributes, useRef } from 'react';

interface TextAreaProps extends Omit<HTMLAttributes<HTMLTextAreaElement>, 'size'> {
	id: string;
	name: string;
	value: string;
	onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
	placeholder: string;
}

const TextArea = ({ id, name, placeholder, onChange, ...props }: TextAreaProps) => {
	const ref = useRef<HTMLTextAreaElement | null>(null);

	return (
		<Container
			id={id}
			name={name}
			ref={ref}
			placeholder={placeholder}
			onChange={e => {
				if (ref && ref.current) {
					ref.current.style.height = 'auto';
					ref.current.style.height = `${ref.current.scrollHeight}px`;
					onChange(e);
				}
			}}
			{...props}
		/>
	);
};

const Container = styled.textarea`
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
