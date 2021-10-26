require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

// additional security
const rateLimiter = require('express-rate-limit');
const cors = require('cors');
const xss = require('xss-clean');
const helmet = require('helmet');

// connect DB
const connectDB = require('./db/connect');

// routes
const authRouter = require('./routes/auth');
// const jobsRouter = require('./routes/jobs');

/*
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const authenticateUser = require('./middleware/authentication');

// Swagger
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
*/
// extra packages
app.set('trust proxy', 1);
app.use(
	rateLimiter({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100, // limit each IP to 100 requests per windowMs
	})
);
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(xss());

/*
app.get('/', (req, res) => {
	res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>');
});
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
*/
// routes
app.use('/api/v1/auth', authRouter);
// app.use('/api/v1/jobs', authenticateUser, jobsRouter);

// app.use(notFoundMiddleware);
// app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

// Accessing the path module
const path = require('path');

// Step 1:
app.use(express.static(path.resolve(__dirname, './frontend/build')));
// Step 2:
app.get('*', function (request, response) {
	response.sendFile(path.resolve(__dirname, './frontend/build', 'index.html'));
});

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		app.listen(port, console.log(`Server is listening on port ${port}...`));
	} catch (error) {
		console.log(error);
	}
};

start();
