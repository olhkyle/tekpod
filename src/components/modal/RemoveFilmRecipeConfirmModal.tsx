import styled from '@emotion/styled';
import ModalLayout from './ModalLayout';
import { ModalDataType } from './modalType';
import useToastStore from '../../store/useToastStore';
import { RestricedRecipeWithImage } from '../../supabase/schema';
import useRemoveRecipeMutation from '../../hooks/mutations/useRemoveFilmRecipeMutation';
import { LoadingSpinner } from '../layout';
import { QueryRefetch } from '../../store/useModalStore';

interface RemoveFilmRecipeConfirmModalProps {
	id: string;
	data: RestricedRecipeWithImage;
	isOpen: boolean;
	type: ModalDataType;
	refetch: QueryRefetch;
	onClose: () => void;
	onTopLevelModalClose: () => void;
}

const RemoveFilmRecipeConfirmModal = ({
	id,
	data,
	isOpen,
	type,
	refetch,
	onClose,
	onTopLevelModalClose,
}: RemoveFilmRecipeConfirmModalProps) => {
	const { mutate: remove, isPending } = useRemoveRecipeMutation(data?.id);
	const { addToast } = useToastStore();

	const handleRecipeDelete = () => {
		remove(
			{ id: data?.id, path: data?.imgSrc.replace(/^.*recipe\//, '') },
			{
				onSuccess: () => {
					addToast({ status: 'success', message: 'Successfully delete recipe' });
					onClose();
				},
				onError: () => {
					addToast({ status: 'error', message: 'Error happens, deleting recipe' });
				},
				onSettled: () => {
					onTopLevelModalClose();
					refetch();
				},
			},
		);
	};

	return (
		<ModalLayout id={id} isOpen={isOpen} type={type} title={'Delete Recipe'} onClose={onClose} size="sm">
			<ButtonGroup>
				<YesButton type="button" onClick={handleRecipeDelete}>
					{isPending ? <LoadingSpinner /> : 'YES'}
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

export default RemoveFilmRecipeConfirmModal;
