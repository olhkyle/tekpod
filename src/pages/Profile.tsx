import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import supabase from '../supabase/service';
import useUserStore from '../store/userStore';
import { Button } from '../components';
import { useLoading } from '../hooks';
import useToastStore from '../store/useToastStore';
import { routes } from '../constants';
import { toastData } from '../constants/toast';

const ProfilePage = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const { startTransition, Loading, isLoading } = useLoading();
	const { userInfo, resetUser } = useUserStore();
	const { addToast } = useToastStore();

	const handleLogout = async () => {
		try {
			const { error } = await startTransition(supabase.auth.signOut());

			if (error) {
				throw new Error(error?.message);
			}

			resetUser();
			addToast(toastData.PROFILE.LOGOUT.SUCCESS);
			navigate(routes.HOME);
		} catch (e) {
			console.error(e);
			addToast(toastData.PROFILE.LOGOUT.ERROR);
		} finally {
			queryClient.setQueryData(['auth'], null);
			queryClient.clear();
		}
	};

	// TODO: setModal EditProfileModal
	// TODO:  fix fadeout Modal Animation and Drawer Animation

	return (
		<Container>
			<UserContainer>
				<User>✹ {userInfo?.user?.user_metadata?.nickname ?? userInfo?.user?.email?.split('@').at(0)} ✹ </User>
				<EditButton type="button" onClick={() => {}}>
					Edit Profile
				</EditButton>
			</UserContainer>
			<Bottom>
				<Title>Keep Writing ? </Title>
				<LogoutButton type="button" onClick={handleLogout}>
					{isLoading ? Loading : 'LogOut ⇲'}
				</LogoutButton>
			</Bottom>
		</Container>
	);
};

const Container = styled.section`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	gap: 32px;
	height: calc(100dvh - 3 * var(--nav-height));
`;

const UserContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 8px;
`;

const User = styled.h2`
	min-width: 270px;
	font-size: var(--fz-h4);
	font-weight: var(--fw-bold);
	color: var(--white);
	background: linear-gradient(135deg, var(--blue200), var(--grey200));
	text-align: center;
`;

const EditButton = styled(Button)`
	padding: calc(var(--padding-container-mobile) * 0.75) var(--padding-container-mobile);
	font-size: var(--fz-p);
	font-weight: var(--fw-medium);
	border: 1px solid var(--grey100);
	border-radius: var(--radius-s);

	&:hover {
		background-color: var(--greyOpacity50);
	}
`;

const Bottom = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
`;

const Title = styled.p`
	min-width: 270px;
	padding: calc(var(--padding-container-mobile) / 1.2) var(--padding-container-mobile);
	font-size: var(--fz-h7);
	font-weight: var(--fw-medium);
	color: var(--white);
	background: linear-gradient(to right, var(--grey600), var(--grey200));
	text-align: center;
`;

const LogoutButton = styled(Button)`
	padding: var(--padding-container-mobile);
	min-width: 270px;
	color: var(--white);
	background-color: var(--black);
	font-size: var(--fz-p);
	font-weight: var(--fw-bold);
	transition: background 0.15s ease-in-out;

	&:hover {
		background-color: var(--grey900);
	}
`;

export default ProfilePage;
