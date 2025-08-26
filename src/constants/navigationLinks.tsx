import { IoMdNotifications } from 'react-icons/io';
import { FaCalculator } from 'react-icons/fa';
import { RiBook3Line, RiCamera3Line } from 'react-icons/ri';
import { SiOnlyoffice } from 'react-icons/si';
import { LuTimer } from 'react-icons/lu';
import { routes } from '.';

const navigationLinks = [
	{
		to: routes.TODO_REMINDER,
		icon: <IoMdNotifications size="42" color="var(--white)" />,
		title: 'Todo',
	},
	{
		to: routes.EXPENSE_TRACKER,
		icon: <FaCalculator size="38" color="var(--blue100)" />,
		title: 'Expense',
	},
	{
		to: routes.DIARY,
		icon: <RiBook3Line size="42" color="var(--blue100)" />,
		title: 'Diary',
	},
	{
		to: routes.FILM_RECIPE,
		icon: <RiCamera3Line size="46" color="var(--blue100)" />,
		title: 'Recipe',
	},
	{
		to: routes.COMMUTE_TRACKER,
		icon: <SiOnlyoffice size="40" color="var(--blue100)" />,
		title: 'Commute',
	},
	{
		to: routes.POMODORO_TIMER,
		icon: <LuTimer size="48" color="var(--blue100)" />,
		title: 'Pomodoro',
	},
	// {
	// 	to: routes.FAVORITE_PLACE,
	// 	icon: <RiMap2Fill size="42" color="var(--blue100)" />,
	// 	title: 'Fav Map',
	// },
] as const;

export default navigationLinks;
