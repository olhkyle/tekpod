import styled from '@emotion/styled';
import ModalLayout from './ModalLayout';
import { ModalDataType } from './modalType';
import useToastStore from '../../store/useToastStore';
import { useLoading } from '../../hooks';
import { deleteRecipe } from '../../supabase/filmRecipe';
import { RestricedRecipeWithImage } from '../../supabase/schema';

interface DeleteConfirmModalProps {
	id: string;
	data: RestricedRecipeWithImage;
	isOpen: boolean;
	type: ModalDataType;
	onClose: () => void;
	onTopLevelModalClose: () => void;
}

const DeleteConfirmModal = ({ id, data, isOpen, type, onClose, onTopLevelModalClose }: DeleteConfirmModalProps) => {
	const { isLoading, Loading, startTransition } = useLoading();
	const { addToast } = useToastStore();

	// TODO: Modal 상태에서 삭제하기 때문에, mutation이 필요(페이지 전환이 아님)

	const handleRecipeDelete = async () => {
		try {
			await startTransition(deleteRecipe(data?.id));

			addToast({ status: 'success', message: 'Successfully delete recipe' });
			onClose();
		} catch (error) {
			console.error(error);
			addToast({ status: 'error', message: 'Error happens, deleting recipe' });
		} finally {
			onTopLevelModalClose();
		}
	};
	return (
		<ModalLayout id={id} isOpen={isOpen} type={type} title={'Delete Recipe'} onClose={onClose} size="sm">
			<ButtonGroup>
				<YesButton type="button" onClick={handleRecipeDelete}>
					{isLoading ? Loading : 'YES'}
				</YesButton>
				<Button
					type="button"
					onClick={() => {
						onClose();
						onTopLevelModalClose();
					}}>
					NO
				</Button>
			</ButtonGroup>
		</ModalLayout>
	);
};

const ButtonGroup = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 8px;
	margin-top: 16px;
`;

const Button = styled.button`
	padding: var(--padding-container-mobile);
	width: 100%;
	min-height: 40px;
	color: var(--white);
	background-color: var(--black);
	font-size: var(--fz-p);
	font-weight: var(--fw-bold);
	border-radius: var(--radius-s);
	transition: background 0.15s ease-in-out;
`;

const YesButton = styled(Button)`
	background-color: var(--grey300);
	color: var(--grey700);
`;

// const DoubleOverlay = styled.div<{ order: number }>`
// 	position: fixed;
// 	max-width: var(--max-app-width);
// 	min-width: var(--min-app-width);
// 	margin: 0 auto;
// 	height: 100dvh;
// 	background-color: rgba(0, 0, 0, 40%);
// 	inset: 0px;
// 	z-index: calc((var(--overlay-index) * (order + 0.5)));
// `;

export default DeleteConfirmModal;
