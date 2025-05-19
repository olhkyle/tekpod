import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import { MODAL_CONFIG, ModalActionMap, modalType } from '../modal';
import { COMMUTE_STATUS, queryKey, StatusOption } from '../../constants';
import { CommuteRecord, getMonthlyRecords } from '../../supabase';
import { calendar, formatByKoreanTime, getMonthIndexFromMonths, Month } from '../../utils';
import { useModalStore } from '../../store';
import { useClientSession } from '../../hooks';
import { Fragment } from 'react';

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
		<Fragment>
			<Calendar>
				{calendar[monthIndex].map(day => {
					const workedDay = data.find(item => new Date(item.date).getDate() === day);

					return (
						<Day
							key={day}
							status={workedDay?.status ?? COMMUTE_STATUS.HOLIDAY}
							tabIndex={0}
							onClick={() => handleRecordModal({ type: !workedDay ? 'ADD' : 'EDIT', day, commuteData: workedDay })}>
							<Label>{day}</Label>
							<Emoji>
								{workedDay?.status === 'present'
									? '🏢'
									: workedDay?.status === 'remote'
									? '💼'
									: workedDay?.status === 'half_day'
									? '🥝'
									: workedDay?.status === 'absent'
									? '💤'
									: '🏝️'}
							</Emoji>
						</Day>
					);
				})}
			</Calendar>
			<Overview>
				<li>
					<span>Full-Time</span>
					<p>{data.filter(day => day.status === 'present').length}</p>
				</li>
				<li>
					<span>Remote</span>
					<p>{data.filter(day => day.status === 'remote').length}</p>
				</li>
			</Overview>
		</Fragment>
	);
};

const Calendar = styled.ul`
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	gap: 8px;
	margin: 32px auto 16px;
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

const Overview = styled.ul`
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-bottom: 16px;

	li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--padding-container-mobile);
		background-color: var(--grey50);
		border-radius: var(--radius-s);

		span {
			color: var(--grey800);
			font-weight: var(--fw-semibold);
		}

		p {
			color: var(--blue200);
			font-size: var(--fz-h7);
			font-weight: var(--fw-semibold);
		}
	}
`;

export default Records;
