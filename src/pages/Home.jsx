import { Card, Fab, Typography, Button } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { Link } from 'react-router-dom';

const Home = () => {
	const { isConnected, isConnecting, address } = useAccount();
	const [jobList, setJobList] = useState([]);

	useEffect(() => {
		if (!isConnected) return;
		const getContracts = async () => {
			const data = await fetch(`http://localhost:5000/getContracts/${address}`);
			const jobs = await data.json();
			console.log(jobs);
			setJobList(jobs);
		};
		getContracts();
	}, [isConnected, address]);

	if (!isConnected) {
		return (
			<Typography variant='h3' align='center'>
				{isConnecting ? 'Connecting...' : 'Connect Your Wallet'}
			</Typography>
		);
	}

	return (
		<>
			<Typography variant='h3' align='center'>
				My Jobs
			</Typography>
			{jobList.length > 0 &&
				jobList.map((j, i) => (
					<Link to={`/job/${j.alias}`} key={j.id}>
						<Card variant='outlined' sx={{ margin: '2em 0' }}>
							<CardContent>
								<Typography
									sx={{ fontSize: 14 }}
									color='text.secondary'
									gutterBottom
								>
									{j.alias}
								</Typography>
								<Typography variant='h5' component='div'>
									{j.descrip}
								</Typography>
								<Typography sx={{ mb: 1.5 }} color='text.secondary'>
									{j.finalized}
								</Typography>
								<Typography variant='body2'>{j.payout} ETH Bounty</Typography>
								<Typography variant='body2'>
									{j.requestedMessageCount} Messages Requested
								</Typography>
							</CardContent>
							<CardActions>
								<Button size='small'>View Contract</Button>
							</CardActions>
						</Card>
					</Link>
				))}
			{!jobList.length && (
				<Typography align='center' color='textSecondary'>
					You have no jobs
				</Typography>
			)}
			<Link to='/add'>
				<Fab
					color='primary'
					aria-label='add'
					style={{ position: 'absolute', bottom: '20px', right: '20px' }}
				>
					<AddIcon />
				</Fab>
			</Link>
		</>
	);
};

export default Home;
