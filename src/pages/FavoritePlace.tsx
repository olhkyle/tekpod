import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Container as MapDiv, NaverMap, Marker, useNavermaps } from 'react-naver-maps';

const favPlaces: { id: number; label: string; coords: [number, number]; order: number }[] = [
	{ id: 1, coords: [37.497175, 127.027926], label: '강남', order: 1 },
	{ id: 2, coords: [37.5665, 126.978], label: '서울 시청', order: 2 },
	{ id: 3, coords: [37.5702, 126.992], label: '종로구청', order: 3 },
	{ id: 4, coords: [37.5511, 126.9882], label: '남산타워', order: 4 },
	{ id: 5, coords: [37.558, 126.978], label: '명동', order: 5 },
	{ id: 6, coords: [37.563, 126.985], label: '을지로', order: 6 },
];

type Place = {
	address: string;
	category: string;
	description: string;
	mapx: string;
	mapy: string;
	roadAddress: string;
	telephone: string;
	title: string;
};

type Geocode = {
	roadAddress: string;
	jibunAddress: string;
	x: string;
	y: string;
	distance: number;
	adressElements: { types: { code: string; longName: string; shortName: string; types: string[] } }[];
};

const FavoritePlace = () => {
	const [currentPos, setCurrentPos] = useState<{ lat: number; lng: number }>();
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const mapRef = useRef<naver.maps.Map | null>(null);
	const navermaps = useNavermaps();

	const [places, setPlaces] = useState<Geocode[]>([]);
	const [query, setQuery] = useState('');

	useEffect(() => {
		// 현재 위치 가져오기
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				position => {
					setCurrentPos({
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					});
				},
				error => {
					console.error('위치 정보 에러:', error);
					setCurrentPos({ lat: 37.4979, lng: 127.0276 });
				},
			);
		} else {
			setCurrentPos({ lat: 37.5666805, lng: 126.9784147 });
		}
	}, []);

	useEffect(() => {
		if (selectedId !== null && mapRef.current) {
			const place = favPlaces.find(p => p.id === selectedId);
			if (!place) return;

			const infoWindow = new window.naver.maps.InfoWindow({
				content: `<div>${place.label}</div>`,
				pixelOffset: new window.naver.maps.Point(0, -30),
			});

			const marker = new window.naver.maps.Marker({
				position: new window.naver.maps.LatLng(...place.coords),
				map: mapRef.current,
			});

			infoWindow.open(mapRef.current, marker);

			return () => infoWindow.close();
		}
	}, [selectedId]);

	useEffect(() => {
		if (places.length && mapRef.current && navermaps) {
			const place = places[0];

			mapRef.current.setCenter(new navermaps.LatLng(+place.y, +place.x));
		}
	}, [places, navermaps]);

	const handleSearch = async () => {
		if (!query) return;

		const res = await axios.get('/api/v1/search/local.json', {
			params: { query, display: 10 },
		});

		const items: Place[] = res.data.items;

		const getGeoCode = async (query: string) => {
			try {
				const res = await axios.get(`/ntruss/map-geocode/v2/geocode?query=${decodeURIComponent(query)}`);

				return res.data.addresses[0];
			} catch (e) {
				console.error(e);
				return null;
			}
		};

		const convertedPlaces = await Promise.all(
			items.map(async item => {
				const data = await getGeoCode(item.address);
				if (!data) return null;

				return data;
			}),
		);

		setPlaces(convertedPlaces);

		setSelectedId(null); // 선택 초기화
		console.log(convertedPlaces);
	};

	return (
		<section>
			<div>
				<input type="text" placeholder="장소 검색" value={query} onChange={e => setQuery(e.target.value)} />
				<button type="button" onClick={handleSearch}>
					검색
				</button>
			</div>
			<MapContainer>
				<NaverMap
					defaultCenter={currentPos}
					defaultZoom={9}
					defaultMapTypeId={navermaps.MapTypeId.NORMAL}
					ref={ref => {
						if (ref && !mapRef.current) {
							mapRef.current = ref;
						}
					}}>
					<Marker
						position={currentPos}
						title="내 위치"
						icon={{
							url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
							size: new window.naver.maps.Size(24, 24),
						}}
					/>

					{places.map((place, idx) => (
						<Marker
							key={`${idx}_${place.x}_${place.y}`}
							position={new navermaps.LatLng(+place.y, +place.x)}
							title={place.roadAddress}
							icon={{
								content: `<button class="markerBox">
                <div class="totalOrder">${idx + 1}</div>
                ${place.roadAddress}</button>`,
							}}
							onClick={() => {
								setSelectedId(idx);
								// alert(place.roadAddress);

								if (mapRef.current) {
									const map = mapRef.current;
									const latlng = new naver.maps.LatLng(+place.y, +place.x);

									// 위치 먼저 이동 후 줌
									map.panTo(latlng);

									// 약간의 지연을 두고 확대 (선택사항)
									setTimeout(() => {
										map.setZoom(17);
									}, 300); // 300ms 정도가 자연스럽습니다.
								}
							}}
						/>
					))}
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

	.markerBox {
		position: relative;
		padding-right: calc(var(--padding-container-mobile) * 0.5);
		padding-left: calc(var(--padding-container-mobile) * 2);
		height: 30px;
		font-size: 1em;
		color: var(--white);
		background-color: var(--black);
		border-radius: var(--radius-m);

		.totalOrder {
			position: absolute;
			top: 0;
			left: 0;
			line-height: 30px;
			width: 30px;
			height: 30px;
			color: var(--grey600);
			background-color: var(--grey200);
			border-radius: var(--radius-m);
			text-align: center;
		}
	}
`;

export default FavoritePlace;
