import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getDiaries } from '../../supabase/diary';
import { routes } from '../../constants';
import { format } from '../../utils/date';

const Content = () => {
	const { data: diaries } = useQuery({ queryKey: ['diary'], queryFn: getDiaries });

	return (
		<ul>
			{diaries?.map(({ id, title, content, updated_at, tags }) => (
				<li key={id}>
					<Link to={`${routes.DIARY}/${id}`}>
						<h3>{title}</h3>
						<p>{content}</p>
						<span>{format(updated_at)}</span>
						<div>
							{tags?.map(tag => (
								<span key={tag}>{tag}</span>
							))}
						</div>
					</Link>
				</li>
			))}
		</ul>
	);
};

export default Content;
