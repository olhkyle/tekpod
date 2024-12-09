import { useState } from 'react';
import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import type { Diary } from '../../supabase/schema';
import { getSingleDiary } from '../../supabase/diary';
import useRemoveDiaryMutation from '../../hooks/mutations/useRemoveDiaryMutation';
import { LoadingSpinner, EditContentModal } from '..';
import useModalStore from '../../store/useModalStore';
import { routes } from '../../constants';
import queryKey from '../../constants/queryKey';

const ContentBody = () => {
	const { diaryId } = useParams();
	const navigate = useNavigate();

	const { data } = useSuspenseQuery<Diary>({ queryKey: [...queryKey.DIARY, diaryId], queryFn: () => getSingleDiary(diaryId!) });

	const { mutate: remove, isPending } = useRemoveDiaryMutation();

	const { setModal } = useModalStore();
	const [isEditModalOpen] = useState(true);

	const handleEditModalClick = () => setModal({ Component: EditContentModal, props: { isOpen: isEditModalOpen, data, type: 'diary' } });

	return (
		<>
			<EditButton type="button" onClick={handleEditModalClick}>
				Edit
			</EditButton>
			<Description>
				<Title>{data?.title}</Title>
				<ContentList>
					{data?.content
						.split('-')
						.filter(item => item !== '')
						.map((item, idx) => (
							<div key={`${item}_${idx}`}>✹ {item}</div>
						))}
				</ContentList>
				<Feeling>⚡️ {data?.feeling}</Feeling>
			</Description>

			<DeleteButton
				type="button"
				onClick={() => {
					remove(
						{ id: diaryId! },
						{
							onSuccess: () => {
								navigate(routes.DIARY);
							},
						},
					);
				}}>
				{isPending ? <LoadingSpinner /> : '🗑️ Delete'}
			</DeleteButton>
		</>
	);
};

const EditButton = styled.button`
	margin-left: auto;
	padding: calc(var(--padding-container-mobile) / 2) var(--padding-container-mobile);
	font-weight: var(--fw-semibold);
	color: var(--grey700);
	background-color: var(--greyOpacity50);
	border: 1px solid var(--greyOpacity200);
	border-radius: var(--radius-s);
	transition: background 0.15s ease-in-out;

	&:hover,
	&:active {
		background-color: var(--greyOpacity100);
	}
`;

const Description = styled.div`
	display: flex;
	flex-direction: column;
	margin-top: calc(100dvh / 25);
	padding: calc(var(--padding-container-mobile) * 2) var(--padding-container-mobile);
	width: 100%;
	border: 1px solid var(--greyOpacity200);
	border-radius: var(--radius-s);
`;

const Title = styled.h2`
	font-size: var(--fz-h4);
	font-weight: var(--fw-black);
`;

const ContentList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin: 16px 0;
	font-size: var(--fz-h7);
`;

const Feeling = styled.p`
	padding: var(--padding-container-mobile);
	font-weight: var(--fw-semibold);
	color: var(--blue200);
	background-color: var(--blue100);
	border: 1px solid var(--blue300);
	border-radius: var(--radius-s);
`;

const DeleteButton = styled.button`
	margin-top: auto;
	padding: var(--padding-container-mobile);
	width: 100%;
	min-height: 57px;
	font-size: var(--fz-p);
	font-weight: var(--fw-semibold);
	color: var(--white);
	background-color: var(--black);
	transition: background 0.15s ease-in-out;

	&:focus {
		background-color: var(--grey900);
	}
`;

export default ContentBody;
