import styled from '@emotion/styled';
import { useLocation } from 'react-router-dom';
import { RiBook3Line, RiCalculatorLine, RiHome6Line, RiUser3Line } from 'react-icons/ri';
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
						<NavLink href={routes.HOME} aria-label="Link to Home Route">
							<RiHome6Line size={24} />
						</NavLink>
						<NavLink href={routes.EXPENSE_TRACKER} aria-label="Link to Film Recipe Route">
							<RiCalculatorLine size={27} />
						</NavLink>
						<NavLink href={routes.DIARY} aria-label="Link to Diary Route">
							<RiBook3Line size={24} />
						</NavLink>
						<NavLink
							href={data?.user ? `${routes.USER}` : routes.LOGIN}
							aria-label={`Link to ${data?.user ? routes.USER.slice(1) : routes.LOGIN.slice(1)} Route`}>
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
	border-top-left-radius: var(--radius-s);
	border-top-right-radius: var(--radius-s);
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
