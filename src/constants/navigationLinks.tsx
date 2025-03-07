import { IoMdNotifications } from 'react-icons/io';
import { FaCalculator } from 'react-icons/fa';
import { RiBook3Line, RiCamera3Line } from 'react-icons/ri';
import routes from './routes';

const navigationLinks = [
	{
		to: routes.TODO_REMINDER,
		icon: <IoMdNotifications size="24" color="var(--white)" />,
		title: 'Tasks to do',
	},
	{
		to: routes.EXPENSE_TRACKER,
		icon: <FaCalculator size="18" color="var(--blue100)" />,
		title: 'Expense Tracker',
	},
	{
		to: routes.FILM_RECIPE,
		icon: <RiCamera3Line size="22" color="var(--blue100)" />,
		title: 'Film Recipe',
	},
	{
		to: routes.DIARY,
		icon: <RiBook3Line size="21" color="var(--blue100)" />,
		title: 'Diary',
	},
] as const;

export default navigationLinks;
