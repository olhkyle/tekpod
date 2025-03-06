import { Link } from 'react-router-dom';
import { routes } from '../../constants';

const Logo = () => {
	return (
		<Link
			to={routes.HOME}
			css={{
				display: 'inline-flex',
				justifyContent: 'center',
				alignItems: 'center',
				marginLeft: '-2px',
				height: 'calc(var(--nav-height) * 0.7)',
				borderRadius: 'var(--radius-m)',
			}}
			onBlur={e => e.target.blur()}>
			<img
				src="/tekpod.webp"
				alt="tekpod logo"
				css={{ display: 'block', width: '100%', height: '100%', borderRadius: 'var(--radius-m)' }}
			/>
		</Link>
	);
};

export default Logo;
