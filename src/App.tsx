import './styles/font.css';
import { Global } from '@emotion/react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import GlobalStyle from './styles/GlobalStyle';
import { Home, Diary, NotFound, Write, Login } from './pages';
import { Layout } from './components';
import { routes } from './constants';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			{
				index: true,
				element: <Home />,
			},
			{
				path: routes.DIARY,
				element: <Diary />,
			},
			{
				path: routes.WRITE,
				element: <Write />,
			},
			{
				path: routes.LOGIN,
				element: <Login />,
			},
		],
	},
	{
		path: '/*',
		element: <NotFound />,
	},
]);

const queryClient = new QueryClient();

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
