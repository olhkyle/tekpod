import { ReactNode } from 'react';
import styled from '@emotion/styled';
import { Link, useLocation } from 'react-router-dom';
import { routes, customPropReceiver, type Route } from '../../constants';

interface NavLinkProps {
	href: Route<typeof routes>;
	children: ReactNode;
}

const NavLink = ({ href, children }: NavLinkProps) => {
	const { pathname } = useLocation();

	return (
		<StyledLink to={href} $isCurrentUrl={pathname === href}>
			{children}
		</StyledLink>
	);
};

const StyledLink = styled(Link, customPropReceiver)<{ $isCurrentUrl: boolean }>`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	padding: calc(var(--padding-container-mobile) * 0.5);
	border-radius: var(--radius-s);
	background-color: ${({ $isCurrentUrl }) => ($isCurrentUrl ? 'var(--black)' : 'var(--white)')};
	transition: background 0.15s ease-in-out;

	&:hover {
		background-color: ${({ $isCurrentUrl }) => ($isCurrentUrl ? 'var(--grey900)' : 'var(--greyOpacity50)')};
	}

	svg {
		color: ${({ $isCurrentUrl }) => ($isCurrentUrl ? 'var(--white)' : 'var(--black)')};
	}
`;

export default NavLink;
