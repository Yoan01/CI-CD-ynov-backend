import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, birthDate, city, postalCode, password } = req.body;

        const age = new Date().getFullYear() - new Date(req.body.birthDate).getFullYear();
        if (age < 18) {
            return res.status(400).json({ message: "L'utilisateur doit avoir au moins 18 ans" });
        }

        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: "L'utilisateur existe déjà" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ firstName, lastName, email, birthDate, city, postalCode, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "Inscription réussie" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Identifiants incorrects" });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: "Identifiants incorrects" });

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password -email -birthDate"); // Exclut les champs sensibles
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};



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


