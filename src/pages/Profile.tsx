import { useNavigate } from 'react-router-dom';
import supabase from '../supabase/service';
import { routes } from '../constants';
import useUserStore from '../store/userStore';
import styled from '@emotion/styled';

const Profile = () => {
	const navigate = useNavigate();
	const { resetUser } = useUserStore();

	const handleLogout = async () => {
		try {
			const { error } = await supabase.auth.signOut();

			if (!error) {
				resetUser();
				navigate(routes.LOGIN);
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Container>
			<Title>﹡ KEEP WRITING ? ﹡ </Title>
			<LogoutButton type="button" onClick={handleLogout}>
				로그아웃
			</LogoutButton>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 32px;
	height: calc(100dvh - 2 * var(--nav-height));
`;

const Title = styled.h2`
	width: 100%;
	font-size: var(--fz-h5);
	font-weight: var(--fw-bold);
	color: var(--white);
	background: linear-gradient(to right, var(--blue200), var(--grey200));
	text-align: center;
`;

const LogoutButton = styled.button`
	padding: calc(var(--padding-container-mobile) / 1.2) var(--padding-container-mobile);
	min-width: 270px;
	color: var(--white);
	background-color: var(--black);
	font-weight: var(--fw-bold);
	border-radius: var(--radius-s);
	transition: background 0.15s ease-in-out;

	&:hover {
		background-color: var(--grey900);
	}
`;

export default Profile;
