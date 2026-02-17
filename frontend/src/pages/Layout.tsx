
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useState } from 'react';

export default function Layout() {
	const navigate = useNavigate()
	const isHome = window.location.pathname === "/"
	const isReports = window.location.pathname.startsWith('/app/reports')

	// Tab navigation state
	const navTabs = [
		{ label: 'Home', path: '/' },
		{ label: 'Dashboard', path: '/app/dashboard' },
		{ label: 'Logs', path: '/app/logs' },
		{ label: 'Simulation', path: '/app/simulation' },
		{ label: 'Overrides', path: '/app/overrides' },
		{ label: 'Reports', path: '/app/reports' },
		{ label: 'Settings', path: '/app/settings' },
	];
	const currentTab = navTabs.findIndex(tab => window.location.pathname === tab.path || (tab.path !== '/' && window.location.pathname.startsWith(tab.path)));
	const [tabValue, setTabValue] = useState(currentTab === -1 ? 0 : currentTab);

	function handleTabChange(event: React.SyntheticEvent, newValue: number) {
		setTabValue(newValue);
		navigate(navTabs[newValue].path);
	}
	function signOut() {
		localStorage.removeItem('token')
		navigate('/login')
	}

	return (
		<Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa' }}>
			<AppBar position="static" color="default" elevation={3} sx={{ borderRadius: '0 0 24px 24px', mb: 2 }}>
				<Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2 }}>
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
							<Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main', letterSpacing: 1 }}>
								RailSynQ
							</Typography>
						</Link>
					</Box>
					<Tabs
						value={tabValue}
						onChange={handleTabChange}
						textColor="primary"
						indicatorColor="primary"
						sx={{ minHeight: 48 }}
					>
						{navTabs.map((tab, idx) => (
							<Tab key={tab.path} label={tab.label} sx={{ fontWeight: 600, fontSize: 16, minWidth: 110 }} />
						))}
					</Tabs>
					<Button
						variant="contained"
						color="primary"
						sx={{ fontWeight: 600, borderRadius: 2, boxShadow: 2, ml: 2 }}
						onClick={signOut}
					>
						Sign out
					</Button>
				</Toolbar>
			</AppBar>
			<Box sx={{ px: { xs: 1, sm: 3, md: 6 }, py: 2 }}>
				<Outlet />
			</Box>
		</Box>
	);
}


