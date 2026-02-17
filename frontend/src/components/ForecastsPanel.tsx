
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import FlashOnIcon from '@mui/icons-material/FlashOn';

interface Forecast {
	icon: string;
	message: string;
}

const iconMap: Record<string, React.ReactNode> = {
	'⚠️': <WarningAmberIcon sx={{ color: '#f59e42' }} />,
	'⚡': <FlashOnIcon sx={{ color: '#f59e42' }} />,
};

export default function ForecastsPanel({ forecasts }: { forecasts?: Forecast[] }) {
	const items: Forecast[] = forecasts && forecasts.length > 0 ? forecasts : [
		{ icon: '⚠️', message: 'High chance of bottleneck at Section B (3 trains converging).' },
		{ icon: '⚡', message: 'Possible signal congestion near Station C.' }
	];
	return (
		<Card sx={{ bgcolor: '#fffde7', borderRadius: 4, width: '100%', boxShadow: 4 }}>
			<CardContent>
				<Typography variant="h6" fontWeight={700} color="warning.main" gutterBottom>
					Disruption Prediction (next 30 mins)
				</Typography>
				<List>
					{items.map((f, i) => (
						<ListItem key={i} alignItems="flex-start" sx={{ py: 0.5 }}>
							<ListItemIcon sx={{ minWidth: 36 }}>
								{iconMap[f.icon] || <WarningAmberIcon sx={{ color: '#f59e42' }} />}
							</ListItemIcon>
							<ListItemText
								primary={<Typography fontSize={15} color="#b45309">{f.message}</Typography>}
							/>
						</ListItem>
					))}
				</List>
			</CardContent>
		</Card>
	);
}


