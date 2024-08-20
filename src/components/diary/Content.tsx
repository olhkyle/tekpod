import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { getDiaries } from '../../supabase/diary';
import { routes } from '../../constants';

const Content = () => {
	const { data: diaries } = useQuery({ queryKey: ['diary'], queryFn: getDiaries });

	return (
		<Diaries>
			{diaries?.map(({ id, title, content, feeling, tags }) => (
				<Diary key={id}>
					<DiaryLink to={`${routes.DIARY}/${id}`}>
						<DiaryTitle>{title}</DiaryTitle>
						<div>
							{content
								.split('-')
								.filter(item => item !== '')
								.map((item, idx) => (
									<div key={`${item}_${idx}`}>- {item}</div>
								))}
						</div>
						<Feeling>﹡ {feeling}</Feeling>
						<Tags>
							{tags?.map(tag => (
								<span key={tag}># {tag}</span>
							))}
						</Tags>
					</DiaryLink>
				</Diary>
			))}
		</Diaries>
	);
};

const Diaries = styled.ul`
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-top: 16px;
`;

const Diary = styled.li`
	padding: var(--padding-container-mobile) 0;
	border-bottom: 1px solid var(--greyOpacity100);
`;

const DiaryLink = styled(Link)`
	width: 100%;
	height: 100%;
`;

const DiaryTitle = styled.h3`
	font-size: var(--fz-h5);
	font-weight: var(--fw-semibold);
`;

const Feeling = styled.p`
	margin-top: 16px;
	margin-left: 12px;
	padding: calc(var(--padding-container-mobile) / 4);
	font-size: var(--fz-sm);
	font-weight: var(--fw-medium);
	background-color: var(--blue100);
	border-radius: var(--radius-xs);
	border: 1px solid var(--greyOpacity200);
`;

const Tags = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	margin-top: 8px;

	span {
		display: inline-block;
		padding: calc(var(--padding-container-mobile) / 5) calc(var(--padding-container-mobile) / 2);
		font-size: var(--fz-sm);
		border: 1px solid var(--grey100);
		border-radius: var(--radius-xs);
		background-color: var(--greyOpacity50);
	}
`;

export default Content;
