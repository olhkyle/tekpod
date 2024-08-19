import { useState } from 'react';
import { useIsMountedRef } from './useIsMountedRef';
import { LoadingSpinner } from '../components';

const useLoading = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const ref = useIsMountedRef();

	//  TypeScript의 제네릭 함수에서 async와 제네릭 타입 <T>를 함께 사용할 때, 제네릭 타입의 위치가 JSX 태그로 인식할 수 있어, <T,> 이런식으로 적어준다.
	const startTransition = async <T,>(promise: Promise<T>): Promise<T> => {
		try {
			setLoading(true);

			const data = await promise;
			return data;
		} finally {
			if (ref.isMounted) {
				setLoading(false);
			}
		}
	};

	return { Loading: <LoadingSpinner />, isLoading: loading, startTransition };
};

export default useLoading;
