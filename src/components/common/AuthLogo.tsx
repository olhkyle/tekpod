import { Logo } from '..';

const AuthLogo = () => {
	return (
		<h1 css={{ minWidth: '270px', fontSize: 'var(--fz-h4)', fontWeight: 'var(--fw-black)' }}>
			<Logo />
		</h1>
	);
};

export default AuthLogo;
