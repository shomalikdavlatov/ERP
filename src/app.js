import express from 'express';
import 'dotenv/config';
import { authRouter } from './routes/auth.router.js';


const app = express();

app.use(express.json());
app.use('/api/auth', authRouter);

async function initApp() {
    try {
        await import('./config/database.js');
        app.listen(process.env.PORT, () => {
            console.log("Server is running on port", process.env.PORT);
        });
    }
    catch (error) {
        console.log(error.message);
    }
}

initApp();