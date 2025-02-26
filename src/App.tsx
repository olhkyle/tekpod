import './styles/font.css';
import 'react-day-picker/style.css';
import { lazy } from 'react';
import { Global } from '@emotion/react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import GlobalStyle from './styles/GlobalStyle';
import AuthenticationGuard from './guard/AuthenticationGuard';
import { Layout, DiaryLayout, LoadLazy, RouteError, ExpenseTrackerLayout } from './components';
import { routes } from './constants';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import UpdatePasswordPage from './pages/UpdatePassword';

const DiaryContentPage = lazy(() => import('./pages/DiaryContent'));
const ExpenseTrackerByMonthPage = lazy(() => import('./pages/ExpenseTrackerByMonth'));
const ExpenseTrackerByMonthItemPage = lazy(() => import('./pages/ExpenseTrackerByMonthItem'));
const ExpenseTrackerUpcomingPage = lazy(() => import('./pages/ExpenseTrackerUpcoming'));
const ExpenseTrackerReportPage = lazy(() => import('./pages/ExpenseTrackerReport'));
const ExpenseTrackerCreditCardTransactionPage = lazy(() => import('./pages/ExpenseTrackerCreditCardTransaction'));
const NotFoundPage = lazy(() => import('./pages/NotFound'));

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
					{ path: `:diaryId`, element: <DiaryContentPage /> },
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
					{ path: `report`, element: <ExpenseTrackerReportPage /> },
					{ path: `credit_card`, element: <ExpenseTrackerCreditCardTransactionPage /> },
				],
			},
			{
				path: `${routes.REFLECT}`,
				element: <AuthenticationGuard redirectTo={routes.LOGIN} element={LoadLazy('ReflectAI')} />,
			},
			{
				path: `${routes.USER}`,
				element: <AuthenticationGuard redirectTo={routes.LOGIN} element={LoadLazy('Profile')} />,
			},
		],
	},
	{ path: routes.LOGIN, element: <LoginPage /> },
	{ path: routes.REGISTER, element: <RegisterPage /> },
	{ path: routes.UPDATE_PASSWORD, element: <UpdatePasswordPage /> },
	{
		path: '/*',
		element: <NotFoundPage />,
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
