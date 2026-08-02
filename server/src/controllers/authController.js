const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const admin = require('firebase-admin');

// IMPORTANT: We use environment variables for the Firebase Service Account Key.
// DO NOT hardcode your private key into this file to avoid leaking it on GitHub.
try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Replace literal \n with actual newlines for the private key
        privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
      })
    });
    console.log('Firebase Admin Initialized successfully.');
  }
} catch (e) {
  console.log('Firebase Admin initialization error (Make sure FIREBASE_PRIVATE_KEY is set):', e.message);
}

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Generate Token
    const token = jwt.sign(
      { id: user.id, role: user.role, referenceId: user.referenceId },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, role: user.role, username: user.username });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const existing = await User.findOne({ where: { username } });
    if (existing) return res.status(400).json({ message: 'Username already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      password: hashedPassword,
      role: role || 'Student'
    });

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    
    // Verify the Firebase JWT token
    const decodedToken = await admin.auth().verifyIdToken(credential);
    const { email, uid } = decodedToken;
    
    // We will use email as the username
    const username = email.split('@')[0];
    
    let user = await User.findOne({ where: { username } });
    
    if (!user) {
      // Create new student user
      const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);
      
      user = await User.create({
        username,
        password: hashedPassword,
        role: 'Student'
      });
    }
    
    // Generate Token
    const token = jwt.sign(
      { id: user.id, role: user.role, referenceId: user.referenceId },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, role: user.role, username: user.username });
  } catch (error) {
    console.error('Firebase Google login error:', error);
    res.status(500).json({ message: 'Failed to authenticate with Google' });
  }
};
