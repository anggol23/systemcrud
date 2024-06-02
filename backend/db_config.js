const { Pool } = require('pg');

const pool = new Pool({
	user: 'postgres',
	password: 'root',
	host: 'localhost',
	port: '5432',
	database: 'posting',
});

pool
.connect()
	.then(() => {
		console.log('Connected to PostgreSQL database');
	})
	.catch((err) => {
		console.error('Error connecting to PostgreSQL database', err);
	});
	module.exports = pool;
