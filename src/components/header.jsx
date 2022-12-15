import {
	AppBar,
	Toolbar,
	Box,
	IconButton,
	Typography,
	CssBaseline,
} from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '../twitter_boost.png';

function Header(props) {
	return (
		<>
			<CssBaseline />
			<Box sx={{ flexGrow: 1, marginBottom: '2em' }}>
				<AppBar position='static'>
					<Toolbar>
						<Link to='/'>
							<IconButton
								size='large'
								edge='start'
								color='inherit'
								aria-label='menu'
								sx={{ mr: 2 }}
							>
								<Box
									sx={{
										width: '50px',
										height: '50px',
										display: 'flex',
									}}
								>
									<img src={logo} alt='Logo' />
								</Box>
							</IconButton>
						</Link>
						<Typography variant='h5' sx={{ flexGrow: 1 }}>
							Twitter Boost
						</Typography>
						{props.children}
					</Toolbar>
				</AppBar>
			</Box>
		</>
	);
}

export default Header;
