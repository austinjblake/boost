import { Typography, Box, TextField } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useAccount } from 'wagmi';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Job = () => {
	const { isConnected, address } = useAccount();
	const routeParams = useParams();
	const [contract, setContract] = useState();
	const [contractor, setContractor] = useState();
	const [updater, setUpdater] = useState(0);

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
	}, [isConnected, address, updater]);

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

	async function selectContractor() {
		const data = await fetch(`http://localhost:5000/selectContractor`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				addr: address,
				contractor: contractor,
				alias: routeParams?.id,
			}),
		});
		const res = await data.json();
		console.log(res);
		if (res.success) {
			setContractor('');
			setUpdater(updater + 1);
		}
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
				<Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
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
							{!contract.contractor && (
								<>
									<TextField
										id='filled-basic'
										label='Contractor Address'
										variant='filled'
										value={contractor}
										onChange={(e) => setContractor(e.target.value)}
									/>
									<Button onClick={selectContractor}>Add Contractor</Button>
								</>
							)}
						</ListItem>
					</List>
					<div
						style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
					>
						<ButtonGroup
							size='large'
							variant='contained'
							aria-label='outlined primary button group'
						>
							<Button>Cancel</Button>
							<Button>Finalize</Button>
							<Button>Withdraw</Button>
						</ButtonGroup>
					</div>
				</Box>
			) : (
				<>Invalid Contract ID</>
			)}
		</>
	);
};

export default Job;
