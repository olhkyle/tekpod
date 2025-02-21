import styled from '@emotion/styled';
import { Logo } from '..';

const AuthLogo = () => {
	return (
		<Container>
			<Logo />
		</Container>
	);
};

const Container = styled.h1`
	min-width: 270px;
	font-size: var(--fz-h4);
	font-weight: var(--fw-black);
`;

export default AuthLogo;
