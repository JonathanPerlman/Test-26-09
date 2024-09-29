import express, { Application } from "express";
import cors from "cors";
import beeperRoutes from "./routes/beeperRoutes.js";


const PORT: number = 3000;  
const app: Application = express();



app.use(express.json());    
app.use(cors());
app.use('/api/beepers', beeperRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});