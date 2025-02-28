import request from 'supertest';
import app from '../index.js';
import mongoose from 'mongoose';
import User from '../models/User.js';

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
    await User.deleteMany(); // Nettoyer la BDD après les tests
    await mongoose.connection.close();
});

describe("Tests API Utilisateurs", () => {
    it("Doit inscrire un utilisateur", async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send({
                firstName: "Test",
                lastName: "User",
                email: "test@example.com",
                birthDate: "2000-01-01",
                city: "Lyon",
                postalCode: "69000",
                password: "Password123!"
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("Inscription réussie");
    });

    it("Doit refuser un utilisateur existant", async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send({
                firstName: "Test",
                lastName: "User",
                email: "test@example.com",
                birthDate: "2000-01-01",
                city: "Lyon",
                postalCode: "69000",
                password: "Password123!"
            });

        expect(res.statusCode).toBe(400);
    });

    it("Doit refuser un utilisateur mineur", async () => {
        const response = await request(app)
        .post('/api/users/register')
        .send({ firstName: 'Test', lastName: 'User', email: 'test@example.com', password: 'password', birthDate: '2010-01-01', city: 'Paris', postalCode: '75000' });
    
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toContain("L'utilisateur doit avoir au moins 18 ans");
    });
});

describe("Tests API Utilisateurs - GET /api/users", () => {
    let token;

    beforeAll(async () => {
        // Inscrire un utilisateur et récupérer son token
        const res = await request(app)
            .post('/api/users/register')
            .send({
                firstName: "Admin",
                lastName: "User",
                email: "admin@example.com",
                birthDate: "1990-01-01",
                city: "Paris",
                postalCode: "75000",
                password: "AdminPassword123!"
            });

        expect(res.statusCode).toBe(201);

        // Connexion pour récupérer le token
        const loginRes = await request(app)
            .post('/api/users/login')
            .send({
                email: "admin@example.com",
                password: "AdminPassword123!"
            });

        expect(loginRes.statusCode).toBe(200);
        token = loginRes.body.token; // Stocke le token
    });

    // it("Doit récupérer la liste des utilisateurs (avec token valide)", async () => {
    //     const res = await request(app)
    //         .get('/api/users')
    //         .setHeader('Authorization', `${token}`); // Envoie le token

    //     console.log("Response Body:", res.body); // Ajoute ce log pour voir ce qui est reçu
    //     console.log("Status Code:", res.statusCode);

    //     expect(res.statusCode).toBe(200);
    //     expect(Array.isArray(res.body)).toBe(true); // Vérifie que c'est bien un tableau
    // });

    it("Doit refuser l'accès sans token", async () => {
        const res = await request(app).get('/api/users');
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toContain("Accès refusé, token manquant"); // Modifié pour correspondre au middleware
    });
});

