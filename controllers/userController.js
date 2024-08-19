const jwt = require('jsonwebtoken');
const User = require('../models/userMode');
const path = require('path');

// Replace this with your own token generation function
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const registerUser = async (req, res) => {
    const {
        hospitalName,
        email,
        password,
        address,
        city,
        emergencyWardNumber,
        hospitalRegDate,
        hospitalRegNumber,
        phoneNumber,
        state,
        pincode,
        confirmPassword,      numberOfAmbulances

    } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    try {
        const certificateUpload = req.file ? req.file.path : null;

        const user = await User.create({
            hospitalName,
            email,
            password,
            address,
            certificateUpload,
            city,
            emergencyWardNumber,
            hospitalRegDate,
            hospitalRegNumber,
            phoneNumber,
            state,
            pincode,  numberOfAmbulances
        });

        const token = generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: false,
            secure: false, // Set to false in development
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
        
        

        res.status(201).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: false,
            secure: false, // Set to true in production
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getdata = async (req, res) => {
    try {
        // Example: Fetch all users
        const users = await User.find();

        const token = generateToken(users._id);

       
        // Send the data as a JSON response
        res.status(200).json(users);
    } catch (error) {
        // Handle errors
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};




module.exports = {
    registerUser,
    loginUser,
    getdata 
};
