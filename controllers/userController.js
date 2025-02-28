import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import moment from 'moment'; // Pour manipuler les dates

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *               city:
 *                 type: string
 *               postalCode:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Inscription réussie
 *       400:
 *         description: Utilisateur existe déjà ou a moins de 18 ans
 *       500:
 *         description: Erreur serveur
 */
export const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, birthDate, city, postalCode, password } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const age = new Date().getFullYear() - new Date(req.body.birthDate).getFullYear();
        if (age < 18) {
            return res.status(400).json({ message: "L'utilisateur doit avoir au moins 18 ans" });
        }

        // Vérification si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: "L'utilisateur existe déjà" });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer un nouvel utilisateur
        const user = new User({ firstName, lastName, email, birthDate, city, postalCode, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "Inscription réussie" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Connexion utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie, retourne un token
 *       400:
 *         description: Identifiants incorrects
 *       500:
 *         description: Erreur serveur
 */
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Identifiants incorrects" });

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: "Identifiants incorrects" });

        // Générer un token JWT
        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupérer la liste des utilisateurs
 *     responses:
 *       200:
 *         description: Succès, retourne une liste d'utilisateurs
 *       500:
 *         description: Erreur serveur
 */
export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        await User.findByIdAndDelete(id);
        res.json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


