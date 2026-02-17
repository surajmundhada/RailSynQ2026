
import React, { useState } from 'react';
import type { Recommendation } from '../lib/api';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface SmartRecommendationsProps {
	recommendations: Recommendation[];
	onAccept?: (rec: Recommendation) => void;
	onOverride?: (rec: Recommendation) => void;
}

export default function SmartRecommendations({ recommendations, onAccept, onOverride }: SmartRecommendationsProps) {
	const top = recommendations.slice(0, 3);
	const [openIdx, setOpenIdx] = useState<number | null>(null);
	const [openExampleIdx, setOpenExampleIdx] = useState<number | null>(null);
	const [dismissedExampleKeys, setDismissedExampleKeys] = useState<Set<string>>(new Set());

	const exampleRecs: Array<{ action: string; reason: string; train_id: string }> = [
		{
			action: 'give_precedence: Express 2215 before Passenger 1432',
			reason: 'Saves ~45 mins cumulative delay, improves throughput and reduces fuel.',
			train_id: 'Express 2215',
		},
		{
			action: 'hold_train: Freight F902 for 6 mins at Bina Jn.',
			reason: 'Ensures on-time arrival of Shatabdi 12002 and prevents platform conflict.',
			train_id: 'F902',
		},
		{
			action: 'reroute: Passenger 1735 → Platform 3 at Itarsi',
			reason: 'Avoids clash with Express 2299 arriving in 5 mins.',
			train_id: 'Passenger 1735',
		},
		{
			action: 'regulate_speed: Passenger 1207 → 50 km/h for next 12 km',
			reason: 'Prevents bunching with Intercity 1311 and saves ~8 mins downstream.',
			train_id: 'Passenger 1207',
		},
		{
			action: 'emergency_priority: Medical Relief Train MRT-07',
			reason: 'Clear single-line section immediately for emergency handling.',
			train_id: 'MRT-07',
		},
	];

	return (
		<Card sx={{ bgcolor: '#fff', borderRadius: 4, width: '100%', boxShadow: 6, p: 2 }}>
			<CardContent>
				<Typography variant="h6" fontWeight={700} color="primary" gutterBottom>
					Smart Train Prioritization
				</Typography>
				<Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
					{top.map((rec, idx) => (
						<Box component="li" key={idx} sx={{ border: '1px solid #e5e7eb', borderRadius: 3, mb: 2, p: 2 }}>
							<Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
								<Box>
									<Typography fontWeight={600} color="text.primary">
										{rec.action || `Prioritize Train ${rec.train_id}`}
									</Typography>
									<Typography fontSize={13} color="text.secondary" sx={{ mt: 0.5 }}>
										Impact: saves ~{6 + idx} mins • throughput +{2 + idx}% • fuel -{3 + idx}%
									</Typography>
								</Box>
								<Box sx={{ display: 'flex', gap: 1 }}>
									<Button
										size="small"
										variant="outlined"
										color="info"
										startIcon={<HelpOutlineIcon />}
										sx={{ borderRadius: 2, fontWeight: 600, minWidth: 80 }}
										onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
									>
										Why?
									</Button>
									{onAccept && (
										<Button
											size="small"
											variant="contained"
											color="success"
											startIcon={<CheckCircleIcon />}
											sx={{ borderRadius: 2, fontWeight: 600, minWidth: 80 }}
											onClick={() => onAccept(rec)}
										>
											Accept
										</Button>
									)}
									{onOverride && (
										<Button
											size="small"
											variant="contained"
											color="error"
											startIcon={<HighlightOffIcon />}
											sx={{ borderRadius: 2, fontWeight: 600, minWidth: 80 }}
											onClick={() => onOverride(rec)}
										>
											Override
										</Button>
									)}
								</Box>
							</Box>
							<Collapse in={openIdx === idx} timeout="auto" unmountOnExit>
								<Box sx={{ mt: 1.5, bgcolor: '#f3f4f6', borderRadius: 2, p: 1.5 }}>
									<Typography fontSize={13} color="text.secondary">
										<b>Reason:</b> {rec.reason || (/platform/i.test(rec.action) ? 'Avoid platform conflict and reduce dwell time.' : /cross|precedence|priority/i.test(rec.action) ? 'Passenger load higher; reduces network idle time.' : 'Mitigates upcoming congestion and improves section throughput.')}
									</Typography>
								</Box>
							</Collapse>
						</Box>
					))}

					{/* Static examples appended within the same section */}
					{exampleRecs
						.filter(ex => !dismissedExampleKeys.has(`${ex.train_id}__${ex.action}`))
						.map((ex, idx) => (
							<Box component="li" key={`ex-${idx}`} sx={{ border: '1px solid #e5e7eb', borderRadius: 3, mb: 2, p: 2 }}>
								<Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
									<Box>
										<Typography fontWeight={600} color="text.primary">
											{ex.action}
										</Typography>
										<Typography fontSize={13} color="text.secondary" sx={{ mt: 0.5 }}>
											{idx === 0 && 'Impact: saves ~45 mins cumulative delay, throughput +3%, fuel -2%'}
											{idx === 1 && 'Impact: ensures on-time arrival of Shatabdi 12002, prevents platform conflict'}
											{idx === 2 && 'Impact: avoids clash with Express 2299 arriving in 5 mins'}
											{idx === 3 && 'Impact: prevents bunching with Intercity 1311, saves ~8 mins downstream'}
											{idx === 4 && 'Impact: clear single-line section immediately, emergency handling'}
										</Typography>
									</Box>
									<Box sx={{ display: 'flex', gap: 1 }}>
										<Button
											size="small"
											variant="outlined"
											color="info"
											startIcon={<HelpOutlineIcon />}
											sx={{ borderRadius: 2, fontWeight: 600, minWidth: 80 }}
											onClick={() => setOpenExampleIdx(openExampleIdx === idx ? null : idx)}
										>
											Why?
										</Button>
										{onAccept && (
											<Button
												size="small"
												variant="contained"
												color="success"
												startIcon={<CheckCircleIcon />}
												sx={{ borderRadius: 2, fontWeight: 600, minWidth: 80 }}
												onClick={() => {
													setDismissedExampleKeys(prev => {
														const next = new Set(prev);
														next.add(`${ex.train_id}__${ex.action}`);
														return next;
													});
													onAccept({ train_id: ex.train_id, action: ex.action, reason: ex.reason } as Recommendation);
												}}
											>
												Accept
											</Button>
										)}
										{onOverride && (
											<Button
												size="small"
												variant="contained"
												color="error"
												startIcon={<HighlightOffIcon />}
												sx={{ borderRadius: 2, fontWeight: 600, minWidth: 80 }}
												onClick={() => {
													setDismissedExampleKeys(prev => {
														const next = new Set(prev);
														next.add(`${ex.train_id}__${ex.action}`);
														return next;
													});
													onOverride({ train_id: ex.train_id, action: ex.action, reason: ex.reason } as Recommendation);
												}}
											>
												Override
											</Button>
										)}
									</Box>
								</Box>
								<Collapse in={openExampleIdx === idx} timeout="auto" unmountOnExit>
									<Box sx={{ mt: 1.5, bgcolor: '#f3f4f6', borderRadius: 2, p: 1.5 }}>
										<Typography fontSize={13} color="text.secondary">
											<b>Reason:</b> {ex.reason}
										</Typography>
									</Box>
								</Collapse>
							</Box>
						))}
				</Box>
			</CardContent>
		</Card>
	);
}


