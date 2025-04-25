const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { hashPassword, comparePassword } = require('../utils/hashPassword');

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await hashPassword(password);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ token: generateToken(newUser) });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login request received:", { email, password }); // Debugging log

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.error("User not found for email:", email); // Debugging log
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      console.error("Password mismatch for email:", email); // Debugging log
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    console.log("User authenticated:", user); // Debugging log
    res.json({ token: generateToken(user) });
  } catch (err) {
    console.error("Login server error:", err.message); // Debugging log
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
