import express from 'express';

const app = express();
const PORT = 8000;

app.use(express.json());

app.get('/', (req, res) => {
    console.log(req.url);
    res.send('Hello from sportz express server!');
});

app.listen(PORT, () => {
    console.log(`Server is running at Local: http://localhost:${PORT} `);
});
