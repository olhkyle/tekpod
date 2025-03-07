import { Link } from 'react-router-dom';

import styled from '@emotion/styled';
import { navigationLinks } from '../constants';
import { ShrinkMotionBlock } from '../components';

const HomePage = () => {
	return (
		<Container>
			<Flex>
				{navigationLinks.map(({ to, icon, title }) => (
					<Link to={to} key={to}>
						<StyledShrinkMotionBlock>
							<IconBackground>{icon}</IconBackground>
							<span>{title}</span>
						</StyledShrinkMotionBlock>
					</Link>
				))}
			</Flex>
		</Container>
	);
};

const Container = styled.section`
	width: 100%;
`;

const Flex = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

const StyledShrinkMotionBlock = styled(ShrinkMotionBlock)`
	display: flex;
	align-items: center;
	gap: 16px;
	padding: var(--padding-container-mobile);
	background-color: var(--greyOpacity50);
	border-radius: var(--radius-m);
	font-weight: var(--fw-semibold);
`;

const IconBackground = styled.div`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	width: 32px;
	height: 32px;
	background-color: var(--blue400);
	border-radius: var(--radius-s);
`;

export default HomePage;
