const express = require('express');
const app = express();
const morgan = require('morgan');
const { db } = require('./db');
const port = 3000;

// Routers
const userRouter = require('./routes/user');
const showRouter = require('./routes/show');

app.use(morgan(':method :url :status :response-time ms'));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/users', userRouter);
app.use('/shows', showRouter);

// Placeholder response for our home route
app.get('/', (req, res) => {
	res.status(200).json({
		message:
			'Navigate to the /users or /shows route to interact with our api',
	});
});

app.listen(port, () => {
	db.sync();
	console.log(`Server is running on port: ${port}`);
});
