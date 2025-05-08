import { useSuspenseQuery } from '@tanstack/react-query';
import { getCalculatedTotalPage } from '../utils';

interface UseGetPaginationInfo {
	queryKey: ReadonlyArray<unknown>;
	queryFn: () => Promise<string | Record<string, unknown>[]>;
	staleTime?: number;
	pageSize: number;
}

const DEFAULT_STALE_TIME = 1000 * 3;

const useGetPaginationInfo = ({ queryKey, queryFn, staleTime = DEFAULT_STALE_TIME, pageSize }: UseGetPaginationInfo) => {
	const { data: pageInfo } = useSuspenseQuery({
		queryKey,
		queryFn,
		staleTime,
	});

	const calculatedTotalPage = getCalculatedTotalPage(pageInfo, pageSize);

	return {
		pageInfo,
		calculatedTotalPage,
	};
};

export default useGetPaginationInfo;
