import styled from '@emotion/styled';
import { Link, useNavigate } from 'react-router-dom';
import { Button, ShrinkMotionBlock } from '../components';
import useUserStore from '../store/userStore';
import { navigationLinks, routes } from '../constants';

const MyPage = () => {
	const navigate = useNavigate();
	const { userInfo } = useUserStore();

	return (
		<Container>
			<UserInfo>
				<User>✹ {userInfo?.user?.user_metadata?.nickname || userInfo?.user?.email?.split('@').at(0)} </User>
				<EditButton type="button" onClick={() => navigate(`${routes.USER}/profile`, { state: { user: userInfo?.user } })}>
					Edit
				</EditButton>
			</UserInfo>
			<Navigations>
				{navigationLinks.map(({ to, icon, title }) => (
					<Link to={to} key={to}>
						<StyledShrinkMotionBlock>
							<IconBackground>{icon}</IconBackground>
							<span>{title}</span>
						</StyledShrinkMotionBlock>
					</Link>
				))}
			</Navigations>
		</Container>
	);
};

const Container = styled.section`
	display: flex;
	flex-direction: column;
	/* justify-content: space-between; */
	gap: 32px;
	height: calc(100dvh - 3 * var(--nav-height));
`;

const UserInfo = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: calc(var(--padding-container-mobile)) calc(var(--padding-container-mobile) * 0.75);
	width: 100%;
	background: linear-gradient(135deg, var(--blue200), var(--grey200));
	border-radius: var(--radius-s);
`;

const User = styled.h2`
	font-size: var(--fz-h5);
	font-weight: var(--fw-bold);
	color: var(--white);
`;

const EditButton = styled(Button)`
	padding: calc(var(--padding-container-mobile) * 0.25) calc(var(--padding-container-mobile) * 0.5);
	font-size: var(--fz-sm);
	font-weight: var(--fw-medium);
	color: var(--black);
	background-color: var(--grey50);
	border: 1px solid var(--grey100);
	border-radius: var(--radius-s);

	&:hover {
		background-color: var(--grey100);
	}
`;

const Navigations = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

const StyledShrinkMotionBlock = styled(ShrinkMotionBlock)`
	display: flex;
	align-items: center;
	gap: 16px;
	padding: var(--padding-container-mobile);
	background-color: var(--greyOpacity50);
	border-radius: var(--radius-m);
	font-weight: var(--fw-semibold);
`;

const IconBackground = styled.div`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	width: 32px;
	height: 32px;
	background-color: var(--blue400);
	border-radius: var(--radius-s);
`;

export default MyPage;
