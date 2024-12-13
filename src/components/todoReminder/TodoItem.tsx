import { useState } from 'react';
import styled from '@emotion/styled';
import type { Todo } from '../../supabase/schema';
import { RiCloseFill } from 'react-icons/ri';
import { Button } from '../common';
import { useLoading } from '../../hooks';
import useToastStore from '../../store/useToastStore';
import { removeTodo } from '../../supabase/todos';
import { QueryRefetch } from '../../store/useModalStore';

interface TodoProps {
	todo: Todo;
	order: number;
	refetch: QueryRefetch;
}

const TodoItem = ({ todo, order, refetch }: TodoProps) => {
	const [isCompleted, setIsCompleted] = useState(todo?.completed);

	const { addToast } = useToastStore();
	const { Loading, isLoading, startTransition } = useLoading();

	// TODO: web-socket 연결로 reminder 만들기
	// drag 이벤트를 활용해 뒤쪽에서 왼쪽으로 슬라이드 시 휴지통 버튼
	// 오른쪽으로 슬라이드 시 primary (bookmark)

	const handleRemoveTodo = async () => {
		try {
			await startTransition(removeTodo({ id: todo.id }));

			addToast({ status: 'success', message: 'Successfully remove todo' });
			refetch();
		} catch (error) {
			console.error(error);
			addToast({ status: 'error', message: 'Error happens during removing todo' });
		}
	};
	return (
		<Container>
			{isLoading ? (
				Loading
			) : (
				<>
					<Checkbox>
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
					</Checkbox>
					{isCompleted && (
						<DeleteButton type="button" onClick={handleRemoveTodo}>
							<RiCloseFill size="24" color="var(--black)" />
						</DeleteButton>
					)}
				</>
			)}
		</Container>
	);
};

const Container = styled.li`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const Checkbox = styled.div`
	display: flex;
	align-items: center;
	gap: 32px;
	padding: 16px 8px;
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

const DeleteButton = styled(Button)`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	padding: 8px;
	background-color: var(--greyOpacity50);
	border-radius: var(--radius-s);
	transition: background 0.15s ease-in-out;

	&:hover,
	&:active {
		background-color: var(--greyOpacity100);
	}
`;

export default TodoItem;
