import { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { useSuspenseQuery } from '@tanstack/react-query';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { supabase } from '../../supabase';
import { getSubscribed, getUncompletedAlarms } from '../../supabase/api/alarm';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { queryKey, routes } from '../../constants';

// TODO: add count of reminder_time < currentTime or new Todo
const NotificationLink = () => {
	const { data } = useSuspenseQuery({ queryKey: [...queryKey.ALARM, 'not_completed'], queryFn: getUncompletedAlarms });

	const [reminder, setReminder] = useState<RealtimePostgresChangesPayload<{ [key: string]: unknown }>>(); // toast에 담을 메세지 저장
	const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
	// const { addToast } = useToastStore();
	console.log(reminder);

	// layout nav 단계에서 체킹 하고 있는 형태
	useEffect(() => {
		channelRef.current = getSubscribed(setReminder);

		return () => {
			channelRef.current?.unsubscribe();
		};
	}, []);

	return (
		<Container to={routes.NOTIFICATION}>
			<IoMdNotificationsOutline size="24" color="var(--black)" />
			<Count>{data.count}</Count>
		</Container>
	);
};

const Container = styled(Link)`
	position: relative;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	width: 30px;
	height: 30px;
	cursor: pointer;
	transition: background-color 0.15s ease-in-out;

	&:active {
		border-radius: var(--radius-xs);
		background-color: var(--grey100);
	}
`;

const Count = styled.span`
	position: absolute;
	top: 0;
	right: 0;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	width: 16px;
	height: 16px;
	color: var(--white);
	background-color: var(--blue200);
	border-radius: var(--radius-extra);
	font-size: var(--fz-xs);
	font-weight: var(--fw-medium);
`;

export default NotificationLink;
