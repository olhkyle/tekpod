import './styles/font.css';
import { Global } from '@emotion/react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import GlobalStyle from './styles/GlobalStyle';
import { Home, Diary, NotFound, Write, Profile, Login, Register } from './pages';
import AuthenticationGuard from './guard/AuthenticationGuard';
import { ErrorBoundary, Layout } from './components';
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
		path: '/',
		element: <Layout />,
		errorElement: <ErrorBoundary />,
		children: [
			{
				index: true,
				element: <Home />,
			},
			{
				path: routes.DIARY,
				element: <AuthenticationGuard redirectTo={routes.LOGIN} element={<Diary />} />,
			},
			{
				path: routes.WRITE,
				element: <AuthenticationGuard redirectTo={routes.LOGIN} element={<Write />} />,
			},
			{
				path: `${routes.USER}/:id`,
				element: <AuthenticationGuard redirectTo={routes.LOGIN} element={<Profile />} />,
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
