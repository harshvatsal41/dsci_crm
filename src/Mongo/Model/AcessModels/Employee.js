import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Role from "./Role.js";

// Updated user schema
const employeeSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
    },
    contactNo: {
        type: String,
        required: [true, "Please provide a contact number"],
        validate: {
            validator: function (v) {
                // Ensure the contact number is numeric and at least 10 digits
                return /^\d{10,}$/.test(v);
            },
            message: "Please enter a valid contact number",
        },
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Role",
        default: null,
    },
    isDisabled: {
        type: Boolean,
        default: false,
    },
    isSuperAdmin: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
});

// Hash password before saving the user
employeeSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    // Salt and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password during login
employeeSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Create the User model
const Employee = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);

export default Employee;