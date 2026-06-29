import express from 'express';
import matchRouter from "./routes/matches.js";

const app = express();
const PORT = 8000;

app.use(express.json());

app.get('/', (req, res) => {
    console.log(req.url);
    res.send('Hello from sportz express server!');
});

app.use('/match', matchRouter);

app.listen(PORT, () => {
    console.log(`Server is running at Local: http://localhost:${PORT} `);
});
