import { Dispatch, SetStateAction } from 'react';
import styled from '@emotion/styled';
import { debounce } from 'es-toolkit';

interface CheckboxProps {
	id: string;
	checked: boolean;
	onCheckedChange: Dispatch<SetStateAction<boolean>>;
	onServerTodoCompletedChange?: (completed: boolean) => void;
}

const DEBOUNCED_TIME = 500;

const Checkbox = ({ id, checked, onCheckedChange: onClientCheckedChange, onServerTodoCompletedChange, ...props }: CheckboxProps) => {
	const handleCheckedChange = (newChecked: boolean) => {
		onClientCheckedChange(newChecked);

		const debouncedUpdate = debounce((isChecked: boolean) => {
			if (onServerTodoCompletedChange) {
				onServerTodoCompletedChange(isChecked);
			}
		}, DEBOUNCED_TIME);

		debouncedUpdate(newChecked);
	};

	return (
		<Container>
			<CheckboxRoleButton
				type="button"
				role="checkbox"
				onClick={() => handleCheckedChange(!checked)}
				aria-checked={checked}
				aria-labelledby={`checkbox-${id + 1}`}
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
				onChange={e => handleCheckedChange(e.target.checked)}
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
