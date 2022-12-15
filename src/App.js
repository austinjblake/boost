import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { WagmiConfig, createClient, goerli } from 'wagmi';
import {
	ConnectKitProvider,
	ConnectKitButton,
	getDefaultClient,
} from 'connectkit';
import { Container } from '@mui/material';
import Header from './components/header';
import Home from './pages/Home';
import AddJob from './pages/AddJob';
import Job from './pages/Job';

const alchemyId = process.env.ALCHEMY_ID;
const chains = [goerli];

const client = createClient(
	getDefaultClient({
		appName: 'Your App Name',
		alchemyId,
		chains,
	})
);

function App() {
	return (
		<WagmiConfig client={client}>
			<ConnectKitProvider>
				<Router>
					<Container
						maxWidth='lg'
						style={{ position: 'relative', minHeight: '500px' }}
					>
						<Header>
							<ConnectKitButton />
						</Header>
						<Routes>
							<Route exact path='/' element={<Home />} />
							<Route exact path='/add' element={<AddJob />} />
							<Route path='/job/:id' element={<Job />} />
						</Routes>
					</Container>
				</Router>
			</ConnectKitProvider>
		</WagmiConfig>
	);
}

export default App;
