import styled from '@emotion/styled';
import { useLocation } from 'react-router-dom';
import { RiBook3Line, RiHome6Line, RiCamera3Line, RiUser3Line } from 'react-icons/ri';
import { NavLink } from '.';
import { useAuthQuery } from '../../hooks';
import { routes } from '../../constants';

const BottomNav = () => {
	const { data } = useAuthQuery();
	const { pathname } = useLocation();

	return (
		<>
			{!pathname.includes(routes.UPDATE_PASSWORD) && (
				<Container id="layout-gnb">
					<Links>
						<NavLink href={routes.HOME}>
							<RiHome6Line size={24} />
						</NavLink>
						<NavLink href={routes.FILM_RECIPE}>
							<RiCamera3Line size={26} />
						</NavLink>
						<NavLink href={routes.DIARY}>
							<RiBook3Line size={24} />
						</NavLink>
						<NavLink href={data?.user ? `${routes.USER}` : routes.LOGIN}>
							<RiUser3Line size={24} />
						</NavLink>
					</Links>
					<Spacer />
				</Container>
			)}
		</>
	);
};

const Container = styled.nav`
	position: fixed;
	bottom: 0;
	max-width: var(--max-app-width);
	min-width: var(--min-app-width);
	width: 100%;
	background-color: var(--white);
	border-top: 1px solid var(--grey200);
	z-index: var(--nav-index);
`;

const Links = styled.div`
	display: flex;
	justify-content: space-around;
	align-items: center;
	width: 100%;
	height: var(--nav-height);
`;

const Spacer = styled.div`
	display: block;
	height: 16px;

	@media screen and (min-width: 640px) {
		display: none;
	}
`;

export default BottomNav;
