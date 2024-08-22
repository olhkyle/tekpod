import './styles/font.css';
import { Global } from '@emotion/react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import GlobalStyle from './styles/GlobalStyle';
import AuthenticationGuard from './guard/AuthenticationGuard';
import { NotFound, Login, Register, Content } from './pages';
import { Layout, DiaryLayout, LoadLazy } from './components';
import { routes } from './constants';

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
		element: <Layout />,
		children: [
			{
				index: true,
				element: <AuthenticationGuard redirectTo={routes.LOGIN} element={LoadLazy('Home')} />,
			},
			{
				path: routes.DIARY,
				element: <AuthenticationGuard redirectTo={routes.LOGIN} element={<DiaryLayout />} />,
				children: [
					{
						index: true,
						element: LoadLazy('Diary'),
					},
					{ path: `:diaryId`, element: <Content /> },
				],
			},
			{
				path: routes.WRITE,
				element: <AuthenticationGuard redirectTo={routes.LOGIN} element={LoadLazy('Write')} />,
			},
			{
				path: `${routes.USER}/:id`,
				element: <AuthenticationGuard redirectTo={routes.LOGIN} element={LoadLazy('Profile')} />,
			},
			{ path: routes.LOGIN, element: <Login /> },
			{ path: routes.REGISTER, element: <Register /> },
		],
	},
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
