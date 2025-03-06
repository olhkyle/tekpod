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
				marginLeft: '-4px',
				height: 'calc(var(--nav-height) * 0.75)',
				borderRadius: 'var(--radius-s)',
			}}
			onBlur={e => e.target.blur()}>
			<img src="/tekpod.webp" alt="tekpod logo" css={{ display: 'block', width: '100%', height: '100%' }} />
		</Link>
	);
};

export default Logo;
