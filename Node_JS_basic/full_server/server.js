import express from 'express';
import routes from './routes/index.js';

const app = express();
const port = 1245;

// Use the routes from the index file
app.use('/', routes);

app.listen(port);

export default app;
