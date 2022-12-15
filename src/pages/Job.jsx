import { Typography, Box } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useAccount } from 'wagmi';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Job = () => {
	const { isConnected, address } = useAccount();
	const routeParams = useParams();
	const [contract, setContract] = useState();

	useEffect(() => {
		if (!isConnected) return;
		const getContracts = async () => {
			const data = await fetch(
				`http://localhost:5000/getJob/${routeParams?.id}`
			);
			const job = await data.json();
			console.log(job[0]);
			setContract(job[0]);
		};
		getContracts();
	}, [isConnected, address]);

	if (!isConnected)
		return (
			<Typography variant='h3' align='center'>
				Connect Your Wallet
			</Typography>
		);

	// check if address == creator or contractor

	// creator
	// new--enter tweet message and contractor address
	// wait for contractor
	// finalize
	// cancel

	// contractor
	// enter tweet id for verify
	// cancel
	// finalize

	// display info
	// progress, role, posts fulfilled, bounty, creator address

	function selectContractor() {
		// take address from input
		// send txn
	}

	function submitTweetID() {
		// logged in address is contractor. send with id
		// send txn
	}

	function withdraw() {
		// logged in address and maybe input for amount
		// send txn. contract decides to pay or not
	}

	function cancelContract() {
		// send logged in address
		// if txn returns success update db
	}

	function finalize() {
		// callable by anyone
	}

	return (
		<>
			<Typography variant='h3' align='center'>
				Contract Details
			</Typography>
			<Typography variant='h5' align='center'>
				{routeParams?.id}
			</Typography>
			{contract ? (
				<Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
					<List>
						<ListItem>
							<ListItemButton>
								<span style={{ marginRight: '10px' }}>
									<strong>Requestor: </strong>
								</span>
								{contract.requestor}
							</ListItemButton>
						</ListItem>
						<ListItem>
							<ListItemButton>
								<span style={{ marginRight: '10px' }}>
									<strong>Description: </strong>
								</span>
								{contract.descrip}
							</ListItemButton>
						</ListItem>
						<ListItem>
							<ListItemButton>
								<span style={{ marginRight: '10px' }}>
									<strong>Finalized?: </strong>
								</span>
								{contract.finalized ? 'Yes' : 'No'}
							</ListItemButton>
						</ListItem>
						<ListItem>
							<ListItemButton>
								<span style={{ marginRight: '10px' }}>
									<strong>Bounty: </strong>
								</span>
								{contract.payout} ETH
							</ListItemButton>
						</ListItem>
						<ListItem>
							<ListItemButton>
								<span style={{ marginRight: '10px' }}>
									<strong>Requested Message Count: </strong>
								</span>
								{contract.requestedMessageCount}
							</ListItemButton>
						</ListItem>
						<ListItem>
							<ListItemButton>
								<span style={{ marginRight: '10px' }}>
									<strong>Contractor: </strong>
								</span>
								{contract.contractor || 'Not Set'}
							</ListItemButton>
						</ListItem>
					</List>
				</Box>
			) : (
				<>Invalid Contract ID</>
			)}
		</>
	);
};

export default Job;
