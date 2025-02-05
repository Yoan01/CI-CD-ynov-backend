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
