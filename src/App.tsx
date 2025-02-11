import './styles/font.css';
import 'react-day-picker/style.css';
import { lazy } from 'react';
import { Global } from '@emotion/react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import GlobalStyle from './styles/GlobalStyle';
import AuthenticationGuard from './guard/AuthenticationGuard';
import { Layout, DiaryLayout, LoadLazy, RouteError, ExpenseTrackerLayout, DiaryContent } from './components';
import { routes } from './constants';

const ExpenseTrackerByMonthPage = lazy(() => import('./pages/ExpenseTrackerByMonth'));
const ExpenseTrackerByMonthItemPage = lazy(() => import('./pages/ExpenseTrackerByMonthItem'));
const ExpenseTrackerUpcomingPage = lazy(() => import('./pages/ExpenseTrackerUpcoming'));
const LoginPage = lazy(() => import('./pages/Login'));
const RegisterPage = lazy(() => import('./pages/Register'));
const NotFound = lazy(() => import('./pages/NotFound'));

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 0,
		},
	},
});

const router = createBrowserRouter([
	{
		path: routes.HOME,
		errorElement: <RouteError />,
		element: <Layout />,
		children: [
			{
				index: true,
				element: <AuthenticationGuard redirectTo={routes.LOGIN} element={LoadLazy('Home')} />,
			},
			{
				path: routes.FILM_RECIPE,
				element: <AuthenticationGuard redirectTo={routes.LOGIN} element={LoadLazy('FilmRecipe')} />,
			},
			{
				path: routes.DIARY,
				element: <AuthenticationGuard redirectTo={routes.LOGIN} element={<DiaryLayout />} />,
				children: [
					{
						index: true,
						element: LoadLazy('Diary'),
					},
					{ path: `:diaryId`, element: <DiaryContent /> },
				],
			},
			{
				path: routes.WRITE,
				element: <AuthenticationGuard redirectTo={routes.LOGIN} element={LoadLazy('Write')} />,
			},
			{
				path: routes.TODO_REMINDER,
				element: <AuthenticationGuard redirectTo={routes.LOGIN} element={LoadLazy('TodoReminder')} />,
			},
			{
				path: routes.EXPENSE_TRACKER,
				element: <AuthenticationGuard redirectTo={routes.LOGIN} element={<ExpenseTrackerLayout />} />,
				children: [
					{
						index: true,
						element: LoadLazy('ExpenseTracker'),
					},
					{ path: `daily`, element: <ExpenseTrackerByMonthPage /> },
					{ path: `daily/:id`, element: <ExpenseTrackerByMonthItemPage /> },
					{ path: `upcoming`, element: <ExpenseTrackerUpcomingPage /> },
				],
			},
			{
				path: `${routes.USER}`,
				element: <AuthenticationGuard redirectTo={routes.LOGIN} element={LoadLazy('Profile')} />,
			},
		],
	},
	{ path: routes.LOGIN, element: <LoginPage /> },
	{ path: routes.REGISTER, element: <RegisterPage /> },
	{
		path: '/*',
		element: <NotFound />,
	},
]);

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<Global styles={GlobalStyle} />
			<RouterProvider router={router} />
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
};

export default App;
