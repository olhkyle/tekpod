import { Dispatch, SetStateAction } from 'react';
import styled from '@emotion/styled';

interface CheckboxProps {
	id: number;
	checked: boolean;
	onCheckedChange: Dispatch<SetStateAction<boolean>>;
}

const Checkbox = ({ id, checked, onCheckedChange, ...props }: CheckboxProps) => {
	return (
		<Container>
			<CheckboxRoleButton
				type="button"
				role="checkbox"
				onClick={() => onCheckedChange(!checked)}
				aria-checked={checked}
				data-state={checked ? 'checked' : 'unchecked'}>
				{checked ? (
					<span data-state={checked ? 'checked' : 'unchecked'}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round">
							<path d="M20 6 9 17l-5-5"></path>
						</svg>
					</span>
				) : null}
			</CheckboxRoleButton>
			<HiddenCheckbox
				type="checkbox"
				id={`checkbox-${id + 1}`}
				checked={checked}
				onChange={e => onCheckedChange(e.target.checked)}
				aria-hidden={true}
				tabIndex={-1}
				{...props}
			/>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	align-items: center;
	gap: 32px;
	padding: 16px 8px;
`;

const CheckboxRoleButton = styled.button`
	width: 18px;
	height: 18px;
	border: 1px solid var(--black);
	border-radius: var(--radius-xs);
	cursor: pointer;

	&[data-state='checked'] {
		background-color: var(--black);
		color: var(--white);
	}
`;

const HiddenCheckbox = styled.input`
	position: absolute;
	margin: 0;
	width: 16px;
	height: 16px;
	opacity: 0;
	pointer-events: none;
	transform: translateX(-100%);
`;

export default Checkbox;
