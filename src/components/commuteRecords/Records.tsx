import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import { MODAL_CONFIG, ModalActionMap, modalType } from '../modal';
import { queryKey, StatusOption } from '../../constants';
import { CommuteRecord, getMonthlyRecords } from '../../supabase';
import { calendar, formatByKoreanTime, getMonthIndexFromMonths, Month } from '../../utils';
import { useModalStore } from '../../store';
import { useClientSession } from '../../hooks';

interface RecordsProps {
	yearAndMonth: {
		year: string;
		month: Month;
	};
}

type CommuteRecordModalType = ModalActionMap[typeof modalType.COMMUTE_RECORDS];

const Records = ({ yearAndMonth: { year, month } }: RecordsProps) => {
	const { session } = useClientSession();
	const monthIndex = getMonthIndexFromMonths(month) + 1;

	const { data } = useSuspenseQuery({
		queryKey: [...queryKey.COMMUTE_RECORDS, `${year}-${(monthIndex + '').padStart(2, '0')}`],
		queryFn: () =>
			getMonthlyRecords({
				year: +year,
				month: monthIndex,
				user_id: session.user.id,
			}),
	});

	const { setModal } = useModalStore();

	const handleRecordModal = ({
		type,
		day,
		commuteData,
	}: {
		type: CommuteRecordModalType;
		day: number;
		commuteData: CommuteRecord | undefined;
	}) => {
		const date = new Date(`${year}-${`${monthIndex}`.padStart(2, '0')}-${`${day}`.padStart(2, '0')}`).toISOString();

		setModal({
			Component: MODAL_CONFIG.COMMUTE_RECORDS[type.toUpperCase() as CommuteRecordModalType].Component,
			props: {
				type: MODAL_CONFIG.COMMUTE_RECORDS[type.toUpperCase() as CommuteRecordModalType].type,
				action: type,
				data: { ...commuteData, date: formatByKoreanTime(date) },
			},
		});
	};

	return (
		<Container>
			{calendar[monthIndex].map(day => {
				const workedDay = data.find(item => new Date(item.date).getDate() === day);

				return (
					<Day
						key={day}
						status={workedDay?.status}
						tabIndex={0}
						onClick={() => handleRecordModal({ type: !workedDay ? 'ADD' : 'EDIT', day, commuteData: workedDay })}>
						<Label>{day}</Label>
						<Emoji>
							{workedDay?.status === 'present' || workedDay?.status === 'remote'
								? '✅'
								: workedDay?.status === 'half_day'
								? '🥝'
								: workedDay?.status === 'absent'
								? '💤'
								: '🫥'}
						</Emoji>
					</Day>
				);
			})}
		</Container>
	);
};

const Container = styled.ul`
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	gap: 8px;
	margin: 32px auto;
`;

const Day = styled.li<{ status: StatusOption }>`
	display: inline-flex;
	flex-direction: column;
	align-items: center;
	padding: calc(var(--padding-container-mobile) * 0.25);
	min-width: 48px;
	min-height: 48px;
	color: ${({ status }) =>
		status === 'present' || status === 'remote' ? 'var(--blue200)' : status === 'half_day' ? 'var(--blue300)' : 'var(--grey600)'};
	background-color: ${({ status }) =>
		status === 'absent'
			? 'var(--grey50)'
			: status === 'present' || status === 'remote' || status === 'half_day'
			? 'var(--blue100)'
			: 'var(--grey50)'};
	border: 1px solid
		${({ status }) =>
			status === 'absent'
				? 'var(--blue300)'
				: status === 'present' || status === 'remote' || status === 'half_day'
				? 'var(--blue400)'
				: 'var(--grey100)'};
	border-radius: var(--radius-s);
	cursor: pointer;

	@media screen and (min-width: 640px) {
		min-height: 60px;
	}
`;

const Label = styled.span`
	display: inline-block;
	width: 100%;
	text-align: start;
`;

const Emoji = styled.span`
	font-size: var(--fz-h4);
`;

export default Records;
