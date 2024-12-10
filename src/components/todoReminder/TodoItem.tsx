import { useState } from 'react';
import styled from '@emotion/styled';
import type { Todo } from '../../supabase/schema';

interface TodoProps {
	todo: Todo;
	order: number;
}

const TodoItem = ({ todo, order }: TodoProps) => {
	const [isCompleted, setIsCompleted] = useState(todo?.completed);

	// TODO: web-socket 연결로 reminder 만들기
	// drag 이벤트를 활용해 뒤쪽에서 왼쪽으로 슬라이드 시 휴지통 버튼
	// 오른쪽으로 슬라이드 시 primary (bookmark)
	return (
		<Container>
			<CheckboxRoleButton
				type="button"
				role="checkbox"
				onClick={() => setIsCompleted(!isCompleted)}
				aria-checked={isCompleted}
				data-state={isCompleted ? 'checked' : 'unchecked'}>
				{isCompleted ? (
					<span data-state={isCompleted ? 'checked' : 'unchecked'}>
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
				id={`todoItem-checkbox-${order + 1}`}
				checked={isCompleted}
				onChange={e => setIsCompleted(e.target.checked)}
				aria-hidden={true}
				tabIndex={-1}
			/>
			<Label htmlFor={`todoItem-checkbox-${order + 1}`}>{todo.content}</Label>
		</Container>
	);
};

const Container = styled.li`
	display: flex;
	align-items: center;
	gap: 32px;
	padding: 16px;
	width: 100%;
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

const Label = styled.label`
	font-size: var(--fz-h7);
`;

export default TodoItem;
