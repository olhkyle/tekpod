import { useSuspenseInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { getDiariesByPage, getDiariesPageInfo } from '../../supabase/diary';
import type { Diary } from '../../supabase/schema';
import { LoadingSpinner } from '../layout';
import { useInfinityScroll } from '../../hooks';
import { routes } from '../../constants';
import getCalculatedTotalPage from '../../utils/getCalculatedTotalPage';
import { EmptyMessage } from '../common';

const PAGE_SIZE = 10;

const DiaryContent = () => {
	const { data: pageInfo } = useSuspenseQuery({ queryKey: ['pageInfo'], queryFn: getDiariesPageInfo });

	const calculatedTotalPage = getCalculatedTotalPage(pageInfo, PAGE_SIZE);

	const { data, hasNextPage, fetchNextPage } = useSuspenseInfiniteQuery({
		queryKey: ['diaryByPage'],
		queryFn: ({ pageParam }) => getDiariesByPage(pageParam, PAGE_SIZE),
		initialPageParam: 1,
		getNextPageParam: (lastPage, __, lastPageParam) => {
			const currentPageSize = lastPage?.length ?? 0;

			if (currentPageSize && lastPageParam < calculatedTotalPage) {
				return lastPageParam + 1;
			}

			return undefined; // 명시적 반환
		},
	});

	const targetRef = useInfinityScroll(fetchNextPage);

	return (
		<>
			<Diaries>
				{data?.pages.flat().map(({ id, title, content, feeling, tags }) => (
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
							<Feeling>⚡️ {feeling}</Feeling>
							<Tags>
								{tags?.map(tag => (
									<span key={tag}># {tag}</span>
								))}
							</Tags>
						</DiaryLink>
					</Diary>
				))}
				{data?.pages.flat().length === 0 && <EmptyMessage emoji={'📝'}>{'ADD DIARY PLEASE'}</EmptyMessage>}
			</Diaries>
			{hasNextPage && (
				<LoadingArea ref={targetRef}>
					<LoadingSpinner />
				</LoadingArea>
			)}
		</>
	);
};

const Diaries = styled.ul`
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-top: 24px;
`;

const Diary = styled.li`
	padding: var(--padding-container-mobile) calc(var(--padding-container-mobile));
	border-bottom: 1px solid var(--greyOpacity100);
	border: 1px solid var(--greyOpacity100);
	border-radius: var(--radius-s);
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
	margin-top: 8px;
	margin-left: auto;
	padding: calc(var(--padding-container-mobile) / 4) calc(var(--padding-container-mobile) / 2);
	font-size: var(--fz-sm);
	font-weight: var(--fw-medium);
	background-color: var(--blue100);
	border-radius: var(--radius-xs);
	border: 1px solid var(--greyOpacity200);
`;

const Tags = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: 8px;
	margin-top: 12px;

	span {
		display: inline-block;
		padding: calc(var(--padding-container-mobile) / 5) calc(var(--padding-container-mobile) / 2);
		font-size: var(--fz-sm);
		border: 1px solid var(--greyOpacity100);
		border-radius: var(--radius-xs);
		color: var(--grey700);
		background-color: var(--greyOpacity50);
	}
`;

const LoadingArea = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: var(--padding-container-mobile);
`;

export default DiaryContent;
