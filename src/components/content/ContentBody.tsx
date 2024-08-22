import { useSuspenseQuery } from '@tanstack/react-query';
import styled from '@emotion/styled';
import { useNavigate, useParams } from 'react-router-dom';
import { Diary } from '../../supabase/schema';
import { getSingleDiary } from '../../supabase/diary';
import useDeleteDiaryMutation from '../../hooks/mutations/useDeleteDiaryMutation';
import { LoadingSpinner } from '../layout';
import { routes } from '../../constants';

const ContentBody = () => {
	const { diaryId } = useParams();
	const navigate = useNavigate();

	const { data } = useSuspenseQuery<Diary>({ queryKey: ['diary', diaryId], queryFn: () => getSingleDiary(diaryId!) });

	const { mutate: remove, isPending } = useDeleteDiaryMutation();

	return (
		<>
			<Description>
				<Title>{data?.title}</Title>
				<ContentList>
					{data?.content
						.split('-')
						.filter(item => item !== '')
						.map((item, idx) => (
							<div key={`${item}_${idx}`}>- {item}</div>
						))}
				</ContentList>
				<Feeling>💡 {data?.feeling}</Feeling>
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
				{isPending ? <LoadingSpinner /> : 'Delete'}
			</DeleteButton>
		</>
	);
};

const Description = styled.div`
	display: flex;
	flex-direction: column;
	margin-top: calc(100dvh / 20);
	padding: calc(var(--padding-container-mobile) * 2) var(--padding-container-mobile);
	width: 100%;
	border: 1px solid var(--greyOpacity200);
	background: linear-gradient(to right, var(--blue100), #fff, var(--red100));
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
	border: 1px solid var(--blue200);
	border-radius: var(--radius-s);
`;

const DeleteButton = styled.button`
	padding: var(--padding-container-mobile);
	width: 100%;
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
