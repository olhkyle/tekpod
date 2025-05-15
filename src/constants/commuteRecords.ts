type StatusOption = (typeof COMMUTE_STATUS)[keyof typeof COMMUTE_STATUS];

const COMMUTE_STATUS = {
	PRESENT: 'present',
	ABSENT: 'absent',
	REMOTE: 'remote',
	HALF_DAY: 'half_day',
} as const;

// because of schema, z.enum can't refer the type of arr (e.g. Object.values(COMMUTE_STATUS))
const commuteStatusList = [COMMUTE_STATUS.PRESENT, COMMUTE_STATUS.ABSENT, COMMUTE_STATUS.REMOTE, COMMUTE_STATUS.HALF_DAY] as const;

export type { StatusOption };
export { COMMUTE_STATUS, commuteStatusList };
