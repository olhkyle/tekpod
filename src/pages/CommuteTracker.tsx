import { useState } from 'react';
import styled from '@emotion/styled';
import { Session } from '@supabase/supabase-js';
import { Select, WorkInProgress } from '../components';
import { calendar, currentMonth, currentYear, months, years } from '../utils';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { queryKey } from '../constants';
import { getMonthlyRecords } from '../supabase';

/**
 *
 * commute_records
 * {
 * 	id : uuid
 * user_id: string;
 * date: string;
 * status: 'present' | 'absent' | 'remote' | 'half_day';
 * check_in: string;
 * check_out: string;
 * workplace: string;
 * notes: boolean;
 * created_at: string;
 * updated_at: string;
 * }
 */

// TODO:
// 1 - change Emoji with SVG
// 2 - add trigger with mutation

const CommuteTrackerPage = () => {
	const queryClient = useQueryClient();
	const session = queryClient.getQueryData(['auth']) as Session;
	const [yearAndMonth, setYearAndMonth] = useState({
		year: `${currentYear}`,
		month: months[currentMonth],
	});

	const { data } = useSuspenseQuery({
		queryKey: [...queryKey.COMMUTE_RECORDS, yearAndMonth],
		queryFn: () =>
			getMonthlyRecords({
				year: +yearAndMonth.year,
				month: months.findIndex(month => month === yearAndMonth.month) + 1,
				user_id: session.user.id,
			}),
	});

	return (
		<Container>
			<Title id="commute-tracker-page-title">Commute Tracker</Title>
			<Controller>
				<Select
					data={years}
					placeholder={'Select Year'}
					descriptionLabel={'Year'}
					currentValue={yearAndMonth.year}
					onSelect={option => setYearAndMonth({ ...yearAndMonth, year: option })}
				/>
				<Select
					data={months.filter((_, idx) => idx <= currentMonth).reverse()}
					placeholder={'Select Month'}
					descriptionLabel={'Month'}
					currentValue={yearAndMonth.month}
					onSelect={option => setYearAndMonth({ ...yearAndMonth, month: months[months.findIndex(month => month === option)] })}
				/>
			</Controller>

			<Checker>
				{calendar[months.findIndex(month => month === yearAndMonth.month) + 1].map(day => {
					const worked = data.find(item => new Date(item.date).getDate() === day);
					return (
						<Day key={day} worked={!!worked}>
							<Label>{day}</Label>
							<Emoji>{worked ? '✅' : '🫥'}</Emoji>
						</Day>
					);
				})}
			</Checker>
			<WorkInProgress />
		</Container>
	);
};

const Container = styled.section``;

const Title = styled.h2`
	font-size: var(--fz-h5);
	font-weight: var(--fw-black);
`;

const Controller = styled.div`
	display: flex;
	align-items: center;
	gap: 16px;
	margin-top: 16px;
	padding: calc(var(--padding-container-mobile) * 0.5);
	background-color: var(--black);
	border-radius: var(--radius-s);
`;

const Checker = styled.ul`
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	gap: 8px;
	margin: 32px auto;
`;

const Day = styled.li<{ worked: boolean }>`
	display: inline-flex;
	flex-direction: column;
	align-items: center;
	padding: calc(var(--padding-container-mobile) * 0.25);
	min-width: 48px;
	min-height: 48px;
	color: ${({ worked }) => (worked ? 'var(--blue200)' : 'var(--grey600)')};
	background-color: ${({ worked }) => (worked ? 'var(--blue100)' : 'var(--grey50)')};
	border: 1px solid ${({ worked }) => (worked ? 'var(--blue300)' : 'var(--grey100)')};
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

export default CommuteTrackerPage;
