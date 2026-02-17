
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import EcoIcon from '@mui/icons-material/Eco';

export default function SustainabilityPanel({ todayKg = 15, totalKg }: { todayKg?: number; totalKg?: number }) {
	return (
		<Card sx={{ bgcolor: '#ecfdf5', borderRadius: 4, width: '100%', boxShadow: 4 }}>
			<CardContent>
				<Typography variant="h6" fontWeight={700} color="success.main" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<EcoIcon sx={{ color: '#059669', mr: 1 }} /> Sustainability Tracker
				</Typography>
				<Typography variant="body2" color="success.dark">
					Emissions saved by AI decisions
				</Typography>
				<Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
					<Typography variant="h4" fontWeight={700} color="success.main">
						~{todayKg} kg CO₂
					</Typography>
					{typeof totalKg === 'number' && (
						<Typography variant="caption" color="success.dark">
							MTD: {totalKg.toFixed(0)} kg
						</Typography>
					)}
				</Box>
			</CardContent>
		</Card>
	);
}


