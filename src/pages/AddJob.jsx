import { Typography, Box, TextField, Button } from '@mui/material';
import { utils } from 'ethers';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import abi from '../Escrow.json';

const AddJob = () => {
	const { isConnected, address } = useAccount();
	const navigate = useNavigate();

	const [desc, setDesc] = useState('');
	const [count, setCount] = useState(0);
	const [email, setEmail] = useState('');
	const [price, setPrice] = useState('0');
	const [contractor, setContractor] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [msgvalue, setMsgvalue] = useState('');
	let hash = '';

	const { config, error } = usePrepareContractWrite({
		address: '0xA120b5532aF8F79a30BAA1D43ee9A805c8c50371',
		abi: abi.abi,
		functionName: 'createContract',
		overrides: {
			from: address,
			value: utils.parseEther(Number(msgvalue).toString()),
		},
		args: [utils.formatBytes32String(hash), utils.parseEther(price), count],
	});
	if (error) console.log(`PREP ERROR: ${error}`);
	const { data, isLoading, isSuccess, write } = useContractWrite({
		...config,
		onSettled(data, err) {
			console.log('Settled', { data, err });
			if (err) return;
			console.log(err);
			callDb();
		},
	});

	async function callDb() {
		//setSubmitting(true);
		const data = await fetch(`http://localhost:5000/create`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				addr: address,
				hash: hash,
				desc: desc,
				bounty: price,
				count: count,
			}),
		});
		const createCall = await data.json();
		console.log(createCall);
		if (createCall.success) {
			setSubmitting(false);
			navigate(`/job/${hash}`);
		} else {
			setSubmitting(false);
			console.log(createCall.error);
		}
	}

	async function submitForm() {
		if (!desc || !count || !price || submitting) return;
		// hash requestor address, count, desc, price
		hash = utils.id(`${address}${desc}${count}${price}`);
		// send txn
		// if return sucess make api call to write in db
		console.log(write, data, error);
		write?.();
	}

	if (!isConnected)
		return (
			<Typography variant='h3' align='center'>
				Connect Your Wallet
			</Typography>
		);
	return (
		<>
			<Typography variant='h3' align='center'>
				Create New Contract
			</Typography>

			<Box
				component='form'
				sx={{
					'& .MuiTextField-root': { m: 2 },
					padding: '2em',
				}}
				noValidate
				autoComplete='off'
			>
				<TextField
					required
					id='description'
					label='Job Description'
					placeholder='Promote my upcoming NFT launch'
					fullWidth
					value={desc}
					onChange={(e) => setDesc(e.target.value)}
				/>
				<TextField
					required
					id='count'
					label='Desired Number of Tweets'
					placeholder='3'
					type='number'
					fullWidth
					value={count}
					onChange={(e) => setCount(e.target.value)}
				/>
				<TextField
					required
					id='price'
					label='Payout Per Message(in ETH)'
					placeholder='3.5'
					type='number'
					fullWidth
					value={price}
					onChange={(e) => setPrice(e.target.value)}
				/>
				<TextField
					required
					id='msgvalue'
					label='Total ETH(bounty + fee)'
					placeholder='11'
					fullWidth
					value={msgvalue}
					onChange={(e) => setMsgvalue(e.target.value)}
				/>
				{/* <TextField
					required
					id='email'
					label='Email Address'
					type='email'
					placeholder='vbut@protonmail.com'
					fullWidth
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/> */}
				{/* <TextField
					id='contractor'
					label='Address of Contractor(if already determined)'
					placeholder='0x2f2b395eD19872f1670A8991df740A9c547DcB0d'
					fullWidth
					value={contractor}
					onChange={(e) => setContractor(e.target.value)}
				/> */}
				<Button variant='contained' onClick={submitForm}>
					{submitting ? 'Please wait...' : 'Submit'}
				</Button>
			</Box>
		</>
	);
};

export default AddJob;
