import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queryKey } from '../../constants';
import { getUser } from '../../supabase';
import { useClientSession } from '../../hooks';

const MyDevice = () => {
	const { session } = useClientSession();
	const { data } = useSuspenseQuery({
		queryKey: queryKey.USER,
		queryFn: () => getUser(session.user?.id),
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
