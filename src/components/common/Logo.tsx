import tekpodImage from '../../assets/tekpod.webp';
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
				width: '35px',
				height: '35px',
				borderRadius: 'var(--radius-m)',
			}}
			onBlur={e => e.target.blur()}>
			<img src={tekpodImage} alt="tekpod logo" css={{ display: 'block', width: '100%', height: '100%', borderRadius: 'var(--radius-m)' }} />
		</Link>
	);
};

export default Logo;
