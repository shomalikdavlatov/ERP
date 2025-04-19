import express from 'express';
import 'dotenv/config';
import routes from './routes/routes.js';


const app = express();

app.use(express.json());
routes().forEach(el => app.use(`/api${el[0]}`, el[1]));


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