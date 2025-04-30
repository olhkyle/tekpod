import styled from '@emotion/styled';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { Session } from '@supabase/supabase-js';
import { queryKey } from '../../constants';
import { getUser } from '../../supabase';

const MyDevice = () => {
	const { user } = useQueryClient().getQueryData(['auth']) as Session;
	const { data } = useSuspenseQuery({
		queryKey: queryKey.USER,
		queryFn: () => getUser(user?.id),
	});

	return <Container>{data.favorite_device}</Container>;
};

const Container = styled.div`
	display: inline-block;
	padding: calc(var(--padding-container-mobile) * 0.3);
	font-weight: var(--fw-black);
	color: var(--blue200);
	background-color: var(--blue100);
	border-radius: var(--radius-s);
`;

export default MyDevice;
