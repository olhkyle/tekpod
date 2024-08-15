import styled from '@emotion/styled';
import { RiBook3Line, RiHome6Line, RiPencilLine, RiUser3Line } from 'react-icons/ri';
import { NavLink } from '.';
import { routes } from '../../constants';
import useUserStore from '../../store/userStore';

const BottomHeader = () => {
	const {
		userInfo: { id },
	} = useUserStore();
	return (
		<Header>
			<NavLink href={routes.HOME}>
				<RiHome6Line size={24} />
			</NavLink>
			<NavLink href={routes.DIARY}>
				<RiBook3Line size={24} />
			</NavLink>
			<NavLink href={routes.WRITE}>
				<RiPencilLine size={26} />
			</NavLink>
			<NavLink href={`${routes.USER}/${id}`}>
				<RiUser3Line size={24} />
			</NavLink>
		</Header>
	);
};

const Header = styled.header`
	display: flex;
	justify-content: space-around;
	align-items: center;
	position: fixed;
	bottom: 0;
	max-width: var(--max-app-width);
	min-width: var(--min-app-width);
	width: 100%;
	height: var(--nav-height);
	background-color: var(--white);
	border-top: 1px solid var(--grey200);
`;

export default BottomHeader;
