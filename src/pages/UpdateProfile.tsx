import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { RiArrowRightSLine } from 'react-icons/ri';
import { Session } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { Button, ShrinkMotionBlock, MODAL_CONFIG } from '../components';
import { supabase } from '../supabase';
import { useLoading } from '../hooks';
import { useToastStore, useModalStore, useUserStore } from '../store';
import { formatByKoreanTime } from '../utils';
import { toastData, routes } from '../constants';

const UpdateProfile = () => {
	const queryClient = useQueryClient();
	const { user } = queryClient.getQueryData(['auth']) as Session;
	const navigate = useNavigate();

	const { resetUser } = useUserStore();
	const { startTransition, Loading, isLoading } = useLoading();
	const { addToast } = useToastStore();
	const { setModal } = useModalStore();

	const handleLogout = async () => {
		try {
			const { error } = await startTransition(supabase.auth.signOut({ scope: 'local' }));

			if (error) {
				throw new Error(error?.message);
			}

			resetUser();
			navigate(routes.HOME, { replace: true });
			addToast(toastData.PROFILE.LOGOUT.SUCCESS);
		} catch (e) {
			console.error(e);
			addToast(toastData.PROFILE.LOGOUT.ERROR);
		} finally {
			queryClient.setQueryData(['auth'], null);
			queryClient.clear();
		}
	};

	const handleUpdateProfileModal = () => {
		const userData = {
			user_id: user.id,
			email: user?.user_metadata.email,
			nickname: user?.user_metadata?.nickname,
		};

		setModal({
			Component: MODAL_CONFIG.USER.PROFILE.Component,
			props: {
				type: MODAL_CONFIG.USER.PROFILE.type,
				data: userData,
			},
		});
	};

	return (
		<Container>
			<UserInfo>
				<Nickname onClick={handleUpdateProfileModal}>
					<Label>Nickname</Label>
					<dd>
						<span>{user?.user_metadata?.nickname}</span>
						<RiArrowRightSLine size="21" />
					</dd>
				</Nickname>
				<Email>
					<Label>Email</Label>
					<dd>{user?.email}</dd>
				</Email>
				<JoinedDate>
					<Label>Join in</Label>
					<dd>{formatByKoreanTime(user?.created_at)}</dd>
				</JoinedDate>
			</UserInfo>

			<Bottom>
				<ResetPasswordButton type="button" onClick={() => navigate(routes.UPDATE_PASSWORD, { state: { email: user?.email } })}>
					Update Password
				</ResetPasswordButton>
				<LogoutButton type="button" onClick={handleLogout}>
					{isLoading ? Loading : 'LogOut'}
				</LogoutButton>
			</Bottom>
		</Container>
	);
};

const Container = styled.section`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 32px;
	height: calc(100dvh - 3 * var(--nav-height));
`;

const UserInfo = styled.dl`
	display: flex;
	flex-direction: column;
	gap: 8px;
	font-size: var(--fz-p);
`;

const Nickname = styled(ShrinkMotionBlock)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: var(--padding-container-mobile);
	font-weight: var(--fw-bold);
	background-color: var(--grey100);
	border: 1px solid var(--grey200);
	border-radius: var(--radius-s);
	cursor: pointer;

	dd {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		gap: 4px;
	}
`;

const Email = styled.div`
	display: flex;
	justify-content: space-between;
	padding: var(--padding-container-mobile);
	font-weight: var(--fw-medium);
	color: var(--grey800);
	background-color: var(--grey50);
	border-radius: var(--radius-s);
`;

const JoinedDate = styled.div`
	display: flex;
	justify-content: space-between;
	padding: var(--padding-container-mobile);
	font-weight: var(--fw-medium);
	color: var(--grey800);
	background-color: var(--grey50);
	border-radius: var(--radius-s);
`;

const Label = styled.dt`
	font-weight: var(--fw-semibold);
`;

const Bottom = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
`;

const ResetPasswordButton = styled(Button)`
	padding: var(--padding-container-mobile);
	width: 100%;
	font-weight: var(--fw-medium);
	border-radius: var(--radius-s);
	color: var(--black);
	background-color: var(--grey100);

	&:hover {
		background-color: var(--grey50);
	}
`;

const LogoutButton = styled(Button)`
	padding: var(--padding-container-mobile);
	width: 100%;
	font-size: var(--fz-p);
	font-weight: var(--fw-medium);
	color: var(--black);
	text-decoration: underline;

	&:hover {
		background-color: var(--grey50);
	}
`;

export default UpdateProfile;
