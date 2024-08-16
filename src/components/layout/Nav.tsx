import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { FiSearch } from 'react-icons/fi';
import { routes } from '../../constants';

const Nav = () => {
	return (
		<Container>
			<Logo>
				<Link to={routes.HOME}>TEKT</Link>
			</Logo>
			<Button>
				<FiSearch size={24} color="var(--black)" />
			</Button>
		</Container>
	);
};

const Container = styled.nav`
	position: fixed;
	top: 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 0 auto;
	padding: 0 var(--padding-container-mobile);
	max-width: var(--max-app-width);
	min-width: var(--min-app-width);
	width: 100%;
	height: var(--nav-height);
	background-color: var(--white);
	border-bottom: 1px solid var(--greyOpacity100);
	z-index: var(--nav-index);
`;

const Logo = styled.h1`
	font-size: var(--fz-h6);
	font-weight: var(--fw-black);
`;

const Button = styled.button`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	width: 27px;
	height: 27px;
	cursor: pointer;
`;

export default Nav;
