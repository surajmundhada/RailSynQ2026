
import React from 'react';
import type { Recommendation } from '../lib/api';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

export default function AIRecommendationCard({ recommendation, onAccept, onOverride }: {
	recommendation: Recommendation | null;
	onAccept: (rec: Recommendation) => void;
	onOverride: (rec: Recommendation) => void;
}) {
	if (!recommendation) return null;

	function buildDecision(rec: Recommendation) {
		const mins = rec.eta_change_seconds ? Math.round(Math.abs(rec.eta_change_seconds) / 60) : undefined;
		const base = rec.action && rec.action.trim().length > 0 ? rec.action : `Prioritize Train ${rec.train_id}${rec.platform ? ` at platform ${rec.platform}` : ''}`;
		if (mins && mins > 0) return `${base} → saves ~${mins} min` + (mins > 1 ? 's' : '');
		return base;
	}

	function buildReason(rec: Recommendation) {
		if (rec.reason && rec.reason.trim().length > 0) return rec.reason;
		if (/platform/i.test(rec.action) || rec.platform) return 'Avoid platform conflict and reduce dwell time.';
		if (/cross|precedence|priority/i.test(rec.action)) return 'Passenger load higher; reduces network idle time.';
		return 'Mitigates upcoming congestion and improves section throughput.';
	}

	return (
		<Card sx={{ mt: 4, borderRadius: 4, boxShadow: 6, background: 'linear-gradient(135deg, #e0ffe6 0%, #f5fff7 100%)' }}>
			<CardContent>
				<Typography variant="h6" color="success.main" fontWeight={700} gutterBottom>
					AI Recommendation
				</Typography>
				<Typography variant="subtitle1" fontWeight={600} color="success.dark" sx={{ mb: 1 }}>
					Decision: <span style={{ color: '#14532d' }}>{buildDecision(recommendation)}</span>
				</Typography>
				<Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
					<b>Reason:</b> <span style={{ color: '#222' }}>{buildReason(recommendation)}</span>
				</Typography>
			</CardContent>
			<CardActions sx={{ gap: 2, pb: 2, pl: 2 }}>
				<Button
					variant="contained"
					color="success"
					size="large"
					startIcon={<CheckCircleIcon />}
					sx={{ fontWeight: 700, borderRadius: 2, px: 4, boxShadow: 2 }}
					onClick={() => onAccept(recommendation)}
				>
					Accept
				</Button>
				<Button
					variant="contained"
					color="error"
					size="large"
					startIcon={<HighlightOffIcon />}
					sx={{ fontWeight: 700, borderRadius: 2, px: 4, boxShadow: 2 }}
					onClick={() => onOverride(recommendation)}
				>
					Override
				</Button>
			</CardActions>
		</Card>
	);
}


