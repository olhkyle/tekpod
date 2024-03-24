import React from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import { FiSearch } from 'react-icons/fi';

const Nav = () => {
	return (
		<Container>
			<Logo>
				<Link to={routes.HOME}>TEKT</Link>
			</Logo>
			<FiSearch size={27} />
		</Container>
	);
};

const Container = styled.nav`
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: fixed;
	top: 0;
	margin: 0 auto;
	padding: 0 1rem;
	width: 100%;
	height: 50px;
	background-color: var(--color-white);
	border-bottom: 1px solid var(--layout-border-color);
	z-index: 9900;
`;

const Logo = styled.h1`
	font-size: 20px;
	font-weight: 600;
`;

export default Nav;
