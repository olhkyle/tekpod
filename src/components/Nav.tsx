import React from 'react';
import styled from '@emotion/styled';

const Nav = () => {
	return <Container>TEKT</Container>;
};

const Container = styled.nav`
	position: fixed;
	top: 0;
	margin: 0 auto;
	padding: 0 1rem;
	width: 100%;
	height: 60px;
	z-index: 9900;
`;

export default Nav;
