
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface KPIs {
	throughput_per_hour?: number;
	avg_delay_minutes?: number;
	congestion_index?: number;
	on_time_percentage?: number;
}

export default function KPIsPanel({ kpis }: { kpis: KPIs | null }) {
	return (
		<Card sx={{ bgcolor: 'indigo.50', borderRadius: 4, minWidth: 320, boxShadow: 4 }}>
			<CardContent>
				<Typography variant="h6" color="primary" fontWeight={700} gutterBottom sx={{ color: '#4338ca' }}>
					Key Performance
				</Typography>
				<List>
					<ListItem>
						<ListItemIcon>
							<TrendingUpIcon sx={{ color: '#6366f1' }} />
						</ListItemIcon>
						<ListItemText
							primary={
								<Typography fontWeight={600} color="text.primary">
									Section Throughput:
									<span style={{ marginLeft: 8, color: '#1e293b', fontWeight: 700 }}>
										{kpis?.throughput_per_hour !== undefined ? `${kpis.throughput_per_hour}%` : '--'}
									</span>
								</Typography>
							}
						/>
					</ListItem>
					<ListItem>
						<ListItemIcon>
							<AccessTimeIcon sx={{ color: '#6366f1' }} />
						</ListItemIcon>
						<ListItemText
							primary={
								<Typography fontWeight={600} color="text.primary">
									Avg Delay:
									<span style={{ marginLeft: 8, color: '#1e293b', fontWeight: 700 }}>
										{kpis?.avg_delay_minutes !== undefined ? `${kpis.avg_delay_minutes} mins` : '--'}
									</span>
								</Typography>
							}
						/>
					</ListItem>
					<ListItem>
						<ListItemIcon>
							<CheckCircleIcon sx={{ color: '#6366f1' }} />
						</ListItemIcon>
						<ListItemText
							primary={
								<Typography fontWeight={600} color="text.primary">
									On-time Trains:
									<span style={{ marginLeft: 8, color: '#1e293b', fontWeight: 700 }}>
										{kpis?.on_time_percentage !== undefined ? `${kpis.on_time_percentage}%` : '--'}
									</span>
								</Typography>
							}
						/>
					</ListItem>
				</List>
			</CardContent>
		</Card>
	);
}


