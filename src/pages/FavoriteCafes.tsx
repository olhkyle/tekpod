import { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';

const FavoriteCafes = () => {
	const mapRef = useRef<HTMLDivElement | null>(null);

	const [isScriptLoaded, setIsScriptLoaded] = useState(false);

	const loadNaverMapScript = () => {
		return new Promise<void>((resolve, reject) => {
			// 이미 로드된 경우
			if (window.naver && window.naver.maps) {
				resolve();
				return;
			}

			// 이미 스크립트 태그가 있는지 확인
			const existingScript = document.querySelector('script[src*="openapi.map.naver.com"]');
			if (existingScript) {
				existingScript.addEventListener('load', () => resolve());
				existingScript.addEventListener('error', () => reject());
				return;
			}

			// 새 스크립트 태그 생성
			const script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${import.meta.env.VITE_REACT_NAVER_MAPS_CLIENT_KEY}`;
			script.async = true;

			script.onload = () => {
				setIsScriptLoaded(true);
				resolve();
			};

			script.onerror = () => {
				reject(new Error('네이버 지도 스크립트 로딩 실패'));
			};

			document.head.appendChild(script);
		});
	};

	const getSuccess = (position: GeolocationPosition) => {
		const latitude = position.coords.latitude;
		const longtitude = position.coords.longitude;

		const { naver } = window;

		if (mapRef.current && naver) {
			const location = new naver.maps.LatLng(latitude, longtitude);
			const map = new naver.maps.Map(mapRef.current, {
				center: location,
				zoom: 15,
			});

			new naver.maps.Marker({
				position: location,
				map,
			});
		}
	};

	const getError = () => {
		console.log('location error');
	};

	useEffect(() => {
		loadNaverMapScript();

		navigator.geolocation.getCurrentPosition(getSuccess, getError);
	}, []);

	return (
		<section>
			<h2>Favorite Cafes</h2>
			<MapContainer id="map" ref={mapRef}></MapContainer>
		</section>
	);
};

const MapContainer = styled.div`
	width: 100%;
	height: 400px;
`;

export default FavoriteCafes;
