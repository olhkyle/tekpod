import { Link } from 'react-router-dom';
import { routes } from '../../constants';

const Logo = () => {
	return (
		<Link
			to={routes.HOME}
			css={{
				marginLeft: '-4px',
				padding: 'calc(var(--padding-container-mobile) * 0.25)',
				borderRadius: 'var(--radius-s)',
				transition: 'background 0.15s ease-in-out',
				'&:hover': {
					backgroundColor: 'var(--greyOpacity100)',
				},
			}}
			onBlur={e => e.target.blur()}>
			TEKT
		</Link>
	);
};

export default Logo;
