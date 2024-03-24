import React from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';

interface NavLinkProps {
	href: string;
	children: React.ReactNode;
}

const NavLink = ({ href, children }: NavLinkProps) => {
	return <StyledLink to={href}>{children}</StyledLink>;
};

const StyledLink = styled(Link)`
	padding: 0.75rem;
	border-radius: var(--radius);
	&:hover {
		background-color: var(--color-transparent-bgColor-hover);
	}
`;
export default NavLink;
