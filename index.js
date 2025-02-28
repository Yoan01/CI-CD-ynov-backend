import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcrypt';
import userRoutes from './routes/userRoutes.js';
import User from './models/User.js';
import {specs, swaggerUi} from "./swagger.js";

const allowedOrigins = ['http://localhost:3000', 'http://cicd-front-ijajoe-9064ed-46-202-134-129.traefik.me/'];

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connecté');
    })
    .catch(err => console.error('Erreur de connexion MongoDB:', err));

    // Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api/users', userRoutes);


// const createAdminUser = async () => {
//     try {
//         const existingAdmin = await User.findOne({ email: "loise.fenoll@ynov.com" });

//         if (!existingAdmin) {
//             const hashedPassword = await bcrypt.hash("ANKymoUTFu4rbybmQ9Mt", 10);
//             const admin = new User({
//                 firstName: "Loise",
//                 lastName: "Fenoll",
//                 email: "loise.fenoll@ynov.com",
//                 birthDate: "1990-01-01",
//                 city: "Paris",
//                 postalCode: "75000",
//                 password: hashedPassword,
//                 isAdmin: true
//             });

//             await admin.save();
//             console.log("Administrateur créé !");
//         }
//     } catch (error) {
//         console.error("Erreur lors de la création de l'admin :", error);
//     }
// };

const server = app.listen(PORT, () => {
    console.log(`Serveur backend en cours d'exécution sur le port ${PORT}`);
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

export default app;
