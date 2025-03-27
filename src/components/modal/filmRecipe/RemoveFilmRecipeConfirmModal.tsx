import styled from '@emotion/styled';
import { ModalDataType } from '..';
import { ModalLayout, LoadingSpinner, Button } from '../..';
import { RestricedRecipeWithImage } from '../../../supabase/schema';
import { useRemoveFilmRecipeMutation } from '../../../hooks';

interface RemoveFilmRecipeConfirmModalProps {
	id: string;
	type: ModalDataType;
	data: RestricedRecipeWithImage;
	onClose: () => void;
	onTopLevelModalClose: () => void;
}

const RemoveFilmRecipeConfirmModal = ({ id, type, data, onClose, onTopLevelModalClose }: RemoveFilmRecipeConfirmModalProps) => {
	const { mutate: remove, isPending } = useRemoveFilmRecipeMutation({ id: data?.id, handlers: { onClose, onTopLevelModalClose } });

	const handleRecipeDelete = () => remove({ id: data?.id, path: data?.imgSrc.replace(/^.*recipe\//, '') });

	return (
		<ModalLayout id={id} type={type} title={'Delete Recipe'} onClose={onClose}>
			<ButtonGroup>
				<NoButton
					type="button"
					onClick={() => {
						onClose();
						onTopLevelModalClose();
					}}>
					NO
				</NoButton>
				<YesButton type="button" onClick={handleRecipeDelete}>
					{isPending ? <LoadingSpinner /> : 'YES'}
				</YesButton>
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

const StyledButton = styled(Button)`
	padding: var(--padding-container-mobile);
	width: 100%;
	min-height: 40px;
	font-size: var(--fz-p);
	font-weight: var(--fw-bold);
	border-radius: var(--radius-s);
`;

const NoButton = styled(StyledButton)`
	color: var(--black);
	background-color: var(--white);
	border: 1px solid var(--grey200);

	&:active,
	&:focus,
	&:hover {
		background-color: var(--grey100);
	}
`;

const YesButton = styled(StyledButton)`
	color: var(--white);
	background-color: var(--black);

	&:active,
	&:focus,
	&:hover {
		background-color: var(--grey900);
	}
`;

export default RemoveFilmRecipeConfirmModal;
