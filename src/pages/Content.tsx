import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getSingleDiary } from '../supabase/diary';

const ContentPage = () => {
	const { diaryId } = useParams();

	const { data } = useQuery({ queryKey: ['diary', diaryId], queryFn: () => getSingleDiary(diaryId!) });

	return (
		<>
			{data?.title}
			{data?.content}
			{data?.feeling}
		</>
	);
};

export default ContentPage;
