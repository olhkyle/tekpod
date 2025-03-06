import { Logo } from '..';

const AuthLogo = () => {
	return (
		<h1 css={{ display: 'flex', alignItems: 'center', minWidth: '270px' }}>
			<Logo />
		</h1>
	);
};

export default AuthLogo;
