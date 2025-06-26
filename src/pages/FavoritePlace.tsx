import styled from '@emotion/styled';
import { Container as MapDiv, NaverMap, Marker, useNavermaps } from 'react-naver-maps';

const FavoritePlace = () => {
	const navermaps = useNavermaps();
	const center = new navermaps.LatLng(37.5666805, 126.9784147);

	return (
		<section>
			<MapContainer>
				<NaverMap defaultCenter={center} defaultZoom={9} defaultMapTypeId={navermaps.MapTypeId.NORMAL}>
					<Marker position={center} />
				</NaverMap>
			</MapContainer>
		</section>
	);
};

const MapContainer = styled(MapDiv)`
	position: relative;
	width: 100%;
	height: calc(100dvh - 2 * var(--nav-height) - 3 * var(--padding-container-mobile));
	border: 1px solid var(--grey100);
	border-radius: var(--radius-s);
`;

export default FavoritePlace;
