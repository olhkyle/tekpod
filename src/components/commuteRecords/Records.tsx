import styled from '@emotion/styled';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { Session } from '@supabase/supabase-js';
import { queryKey, StatusOption } from '../../constants';
import { getMonthlyRecords } from '../../supabase';
import { calendar, formatByKoreanTime, getMonthIndexFromMonths, Month } from '../../utils';
import { useModalStore } from '../../store';
import { MODAL_CONFIG } from '../modal';

interface RecordsProps {
	yearAndMonth: {
		year: string;
		month: Month;
	};
}

const Records = ({ yearAndMonth: { year, month } }: RecordsProps) => {
	const queryClient = useQueryClient();
	const session = queryClient.getQueryData(queryKey.AUTH) as Session;

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

	const handleRecordModal = (day: number) => {
		const date = new Date(`${year}-${`${monthIndex}`.padStart(2, '0')}-${`${day}`.padStart(2, '0')}`).toISOString();

		setModal({
			Component: MODAL_CONFIG.COMMUTE_RECORDS.ADD.Component,
			props: {
				type: MODAL_CONFIG.COMMUTE_RECORDS.ADD.type,
				data: { date: formatByKoreanTime(date) },
			},
		});
	};

	return (
		<Container>
			{calendar[monthIndex].map(day => {
				const workedDate = data.find(item => new Date(item.date).getDate() === day);

				return (
					<Day key={day} status={workedDate?.status} tabIndex={0} onClick={() => handleRecordModal(day)}>
						<Label>{day}</Label>
						<Emoji>
							{workedDate?.status === 'present' || workedDate?.status === 'remote'
								? '✅'
								: workedDate?.status === 'half_day'
								? '🥝'
								: workedDate?.status === 'absent'
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
				? 'var(--blue400)'
				: status === 'present' || status === 'remote' || status === 'half_day'
				? 'var(--blue300)'
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
