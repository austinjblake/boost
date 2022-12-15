import { Card, Fab, Typography } from '@mui/material';
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
				jobList.map((j, i) => <Card key={j.id}>Job {i}</Card>)}
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
