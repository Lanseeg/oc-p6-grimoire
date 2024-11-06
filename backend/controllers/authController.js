const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Controller for user signup
exports.signup = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10); // Hash password
    const user = new User({ email: req.body.email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to create user', error });
  }
};

// Controller for user login
exports.login = async (req, res) => {
  try {
    // Find user email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare provided with hashed database password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a token with the user's ID
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    // Respond with user ID and token
    res.status(200).json({ userId: user._id, token });
  } catch (error) {
    // Log the error and return a 500 status
    console.error('Login error:', error);
    res.status(500).json({ message: 'Failed to login', error });
  }
};
