const dotenv = require('dotenv');
const mysql = require('mysql2/promise');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
dotenv.config();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let connection;
(async function () {
	connection = await mysql.createConnection({
		host: process.env.DB_HOST,
		user: 'admin',
		password: process.env.DB_PASS,
		database: 'sys',
	});
})();

const port = 5000;

app.get('/', (req, res) => {
	res.send('Express server is running!');
});

app.post('/create', async (req, res) => {
	try {
		const userData = await connection.query('CALL CHECK_USER(?)', [
			req.body.addr,
		]);
		const userExists = userData[0][0].length > 0;
		if (!userExists) {
			await connection.query('CALL CREATE_USER(?)', [req.body.addr]);
		}
		await connection.query('CALL CREATE_CONTRACT(?, ?, ?, ?, ?)', [
			req.body.addr,
			req.body.hash,
			req.body.desc,
			req.body.bounty,
			req.body.count,
		]);

		res.send({ success: true });
	} catch (err) {
		res.send({ success: false, error: err });
	}
});

app.get('/getContracts/:addr', async (req, res) => {
	try {
		const result = await connection.query('CALL GET_CONTRACTS_BY_ADDRESS(?)', [
			req.params.addr,
		]);
		res.send(result[0][0]);
	} catch (err) {
		throw err;
	}
});

app.get('/getJob/:alias', async (req, res) => {
	try {
		const result = await connection.query('CALL GET_CONTRACT_BY_ALIAS(?)', [
			req.params.alias,
		]);
		res.send(result[0][0]);
	} catch (err) {
		throw err;
	}
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
