import './styles/font.css';
import 'react-day-picker/style.css';
import { Global } from '@emotion/react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import GlobalStyle from './styles/GlobalStyle';
import AuthenticationGuard from './guard/AuthenticationGuard';
import MyPageLayout from './components/layout/MyPageLayout';
import { Layout, DiaryLayout, LoadLazy, RouteError, ExpenseTrackerLayout } from './components';
import { routes } from './constants';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 0,
		},
	},
});

const router = createBrowserRouter(
	[
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
						{ path: `:diaryId`, element: LoadLazy('DiaryContentPage') },
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
						{ path: `daily`, element: LoadLazy('ExpenseTrackerByMonthPage') },
						{ path: `daily/:id`, element: LoadLazy('ExpenseTrackerByMonthItemPage') },
						{ path: `upcoming`, element: LoadLazy('ExpenseTrackerUpcomingPage') },
						{ path: `report`, element: LoadLazy('ExpenseTrackerReportPage') },
						{ path: `credit_card`, element: LoadLazy('ExpenseTrackerCreditCardTransactionPage') },
					],
				},
				{
					path: `${routes.USER}`,
					element: <AuthenticationGuard redirectTo={routes.LOGIN} element={<MyPageLayout />} />,
					children: [
						{
							index: true,
							element: LoadLazy('MyPage'),
						},
						{
							path: `${routes.PROFILE}`,
							element: LoadLazy('UpdateProfilePage'),
						},
						{
							path: `${routes.UPDATE_PASSWORD}`,
							element: LoadLazy('UpdatePasswordPage'),
						},
					],
				},
			],
		},
		{ path: routes.LOGIN, element: LoadLazy('LoginPage') },
		{ path: routes.REGISTER, element: LoadLazy('RegisterPage') },
		{
			path: '/*',
			element: LoadLazy('NotFoundPage'),
		},
	],
	{
		future: {
			v7_relativeSplatPath: true,
		},
	},
);

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<Global styles={GlobalStyle} />
			<RouterProvider router={router} future={{ v7_startTransition: true }} />
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
};

export default App;
