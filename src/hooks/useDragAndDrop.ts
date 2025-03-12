import { TouchEvent, useRef, useState } from 'react';
import useClickOutside from './useClickOutside';

const DRAG_THRESHOLD = 10; // 픽셀 단위

const useDragAndDrop = () => {
	const [dragX, setDragX] = useState(0);
	const [dragStartX, setDragStartX] = useState<number | null>(null);
	const dragRef = useRef<number>(0);

	const dragContainerRef = useClickOutside<HTMLLIElement>({
		eventHandler: () => {
			setDragX(0);
			dragRef.current = 0;
		},
	});

	// TODO: 리팩토링 필요
	const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
		setDragStartX(event.touches[0].clientX);
		dragRef.current = event.touches[0].clientX;
	};

	const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
		if (dragStartX === null) return;

		const currentX = event.touches[0].clientX;
		const diff = currentX - dragRef.current; // 현재 위치 - 첫 터치 드래그 시작 위치 (음수)

		// 최소 이동 거리를 넘어선 경우에만 드래그 적용
		if (Math.abs(diff) > DRAG_THRESHOLD) {
			const dampingFactor = 0.8;
			const dragAmount = currentX - dragRef.current;
			if (dragAmount < 0) {
				setDragX(Math.max(dampingFactor * dragAmount, -80));
			}
		}
	};

	const handleTouchEnd = () => {
		const SNAP_THRESHOLD = -40;

		if (dragX < SNAP_THRESHOLD) {
			setDragX(-80);
		} else {
			setDragX(0);
		}

		setDragStartX(null);
		dragRef.current = 0;
	};

	return {
		dragX,
		dragContainerRef,
		handlers: { handleTouchStart, handleTouchMove, handleTouchEnd },
	};
};

export default useDragAndDrop;
