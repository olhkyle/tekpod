import React from 'react';
import { Outlet } from 'react-router-dom';
import { Nav, Footer, Main } from '.';

const Layout = () => {
	return (
		<>
			<Nav />
			<Main>
				<Outlet />
			</Main>
			<Footer />
		</>
	);
};

export default Layout;
