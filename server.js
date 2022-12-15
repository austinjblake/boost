const dotenv = require('dotenv');
const mysql = require('mysql2');
const express = require('express');
const app = express();
const cors = require('cors');
dotenv.config();

app.use(cors());

const connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: 'admin',
	password: process.env.DB_PASS,
	database: 'sys',
});

const port = 5000;

app.get('/', (req, res) => {
	res.send('Express server is running!');
});

app.get('/create', (req, res) => {
	connection.query(
		'CALL CREATE_CONTRACT(?, ?, ?, ?, ?)',
		[
			'0xaf2b395eD19872f1670A8991df740A9c547DfB0d',
			'calchash',
			'shill me plz',
			3.5,
			6,
		],
		function (err, result) {
			if (err) throw err;

			console.log('Contract inserted successfully!');
			res.send('contract created!');
		}
	);
});

app.get('/getContracts/:addr', (req, res) => {
	connection.query(
		'CALL GET_CONTRACTS_BY_ADDRESS(?)',
		[req.params.addr],
		function (err, result) {
			if (err) throw err;

			res.send(result[0]);
		}
	);
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
