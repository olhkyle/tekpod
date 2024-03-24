import React from 'react';
import styled from '@emotion/styled';
import { RiMenu2Line, RiBook3Line, RiHome6Line, RiBookmarkLine, RiUser3Line } from 'react-icons/ri';
import { NavLink } from '.';
import routes from '../constants/routes';

const BottomHeader = () => {
	return (
		<Header>
			<SideNavToggleBtn>
				<RiMenu2Line size={24} />
			</SideNavToggleBtn>
			<NavLink href={'recent'}>
				<RiBook3Line size={24} />
			</NavLink>
			<NavLink href={routes.HOME}>
				<RiHome6Line size={24} />
			</NavLink>
			<NavLink href={routes.BOOKMARK}>
				<RiBookmarkLine size={24} />
			</NavLink>
			<NavLink href={routes.USER}>
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
	min-width: vaR(--min-app-width);
	width: 100%;
	height: 52px;
	background-color: var(--color-white);
	border-top: 1px solid var(--layout-border-color);
`;

const SideNavToggleBtn = styled.button`
	padding: 0.8rem;
	border-radius: var(--radius);

	&:hover {
		background-color: var(--color-transparent-bgColor-hover);
	}
`;

export default BottomHeader;
