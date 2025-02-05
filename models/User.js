import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        match: [/^[a-zA-ZÀ-ÿ'-]+$/, "Le prénom n'est pas valide"]
    },
    lastName: {
        type: String,
        required: true,
        match: [/^[a-zA-ZÀ-ÿ'-]+$/, "Le nom n'est pas valide"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "L'email n'est pas valide"]
    },
    birthDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                const age = new Date().getFullYear() - value.getFullYear();
                return age >= 18;
            },
            message: "L'utilisateur doit avoir au moins 18 ans"
        }
    },
    city: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true,
        match: [/^\d{5}$/, "Le code postal doit contenir 5 chiffres"]
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
