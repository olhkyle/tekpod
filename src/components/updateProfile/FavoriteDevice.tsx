import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getUser } from '../../supabase';
import { queryKey } from '../../constants';

interface FavoriteDeviceProps {
	userId: string;
}

const FavoriteDevice = ({ userId }: FavoriteDeviceProps) => {
	const { data } = useSuspenseQuery({
		queryKey: queryKey.USER,
		queryFn: () => getUser(userId),
	});

	return (
		<Container>
			<dt>Favorite Fuji Device</dt>
			<dd>{data?.favorite_device}</dd>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	justify-content: space-between;
	padding: var(--padding-container-mobile);
	font-weight: var(--fw-medium);
	color: var(--grey800);
	background-color: var(--grey50);
	border-radius: var(--radius-s);
`;

export default FavoriteDevice;
