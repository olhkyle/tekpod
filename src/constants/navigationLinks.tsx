import { IoMdNotifications } from 'react-icons/io';
import { FaCalculator } from 'react-icons/fa';
import { RiBook3Line, RiCamera3Line } from 'react-icons/ri';
import { SiOnlyoffice } from 'react-icons/si';
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
		to: routes.FILM_RECIPE,
		icon: <RiCamera3Line size="40" color="var(--blue100)" />,
		title: 'Recipe',
	},
	{
		to: routes.DIARY,
		icon: <RiBook3Line size="34" color="var(--blue100)" />,
		title: 'Diary',
	},
	{
		to: routes.COMMUTE_TRACKER,
		icon: <SiOnlyoffice size="34" color="var(--blue100)" />,
		title: 'Commute',
	},
] as const;

export default navigationLinks;
