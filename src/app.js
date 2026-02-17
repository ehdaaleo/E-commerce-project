import express from 'express';
import connectDB from './config/db.js';
import router from './routes/authRoutes.js';

export const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send({
        message: 'welcome to our website',
    });
});

app.get('/home', (req, res) => {
    res.send({
        message: 'welcome to our home website ',
    });
});

app.use('/auth', router);

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(
            'Server is running on port 3000, click here: http://localhost:' +
                PORT
        );
    });
};

startServer();
