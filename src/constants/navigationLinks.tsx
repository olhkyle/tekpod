import { IoMdNotifications } from 'react-icons/io';
import { FaCalculator } from 'react-icons/fa';
import { RiBook3Line, RiCamera3Line, RiMap2Fill } from 'react-icons/ri';
import { SiOnlyoffice } from 'react-icons/si';
import { LuTimer } from 'react-icons/lu';
import { routes } from '.';

const navigationLinks = [
	{
		to: routes.TODO_REMINDER,
		icon: <IoMdNotifications size="36" color="var(--white)" />,
		title: 'Todo',
	},
	{
		to: routes.EXPENSE_TRACKER,
		icon: <FaCalculator size="32" color="var(--blue100)" />,
		title: 'Expense',
	},
	{
		to: routes.DIARY,
		icon: <RiBook3Line size="36" color="var(--blue100)" />,
		title: 'Diary',
	},
	{
		to: routes.FILM_RECIPE,
		icon: <RiCamera3Line size="40" color="var(--blue100)" />,
		title: 'Recipe',
	},
	{
		to: routes.COMMUTE_TRACKER,
		icon: <SiOnlyoffice size="34" color="var(--blue100)" />,
		title: 'Commute',
	},
	{
		to: routes.FAVORITE_PLACE,
		icon: <RiMap2Fill size="36" color="var(--blue100)" />,
		title: 'Fav Map',
	},
	{
		to: routes.POMODORO_TIMER,
		icon: <LuTimer size="40" color="var(--blue100)" />,
		title: 'Pomodoro',
	},
] as const;

export default navigationLinks;
