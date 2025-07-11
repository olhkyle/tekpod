import { Dispatch, SetStateAction } from 'react';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import supabase from '../service';
import type { Alarm } from '../schema';

type SupabaseChangePayload = {
	schema: string;
	table: string;
	old: unknown;
	new: unknown;
	eventType: '*' | 'INSERT' | 'UPDATE' | 'DELETE';
	errors: Error;
	commit_timestamp: string;
};

const TABLE = import.meta.env.VITE_SUPABASE_DB_TABLE_ALARM;

const getSubscribed = (update: Dispatch<SetStateAction<RealtimePostgresChangesPayload<{ [key: string]: unknown }> | undefined>>) => {
	return supabase
		.channel('db-changes')
		.on(
			'postgres_changes',
			{
				event: '*',
				schema: 'public',
				table: TABLE,
			},
			payload => {
				update(payload);
			},
		)
		.subscribe(status => {
			if (status === 'SUBSCRIBED') return;

			if (status === 'CLOSED') {
				console.log('Realtime Connection Closed');
			}

			console.log('Realtime Connection Established');
		});
};

const getUncompletedAlarms = async () => {
	const { data, error } = await supabase.from(TABLE).select('*').eq('isChecked', false).order('reminder_time', { ascending: false });

	if (error) {
		throw new Error(error.message);
	}

	return { data, count: data.length };
};

const getAlarms = async () => {
	const { data, error } = await supabase.from(TABLE).select('*').order('reminder_time', { ascending: false });

	if (error) {
		throw new Error(error.message);
	}

	return data;
};

const addAlarm = async (data: Omit<Alarm, 'id'>) => {
	const { error: addAlarmError } = await supabase.from(TABLE).insert(data).select();

	if (addAlarmError) {
		throw new Error(addAlarmError.message);
	}
};

export type { SupabaseChangePayload };
export { getSubscribed, getUncompletedAlarms, getAlarms, addAlarm };
