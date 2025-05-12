const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { Customer } = require('../models');

const CLIENT_ID = "713673211556-44h0d0mig3ftbljehtg40aqod2bm0enn.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

router.post('/google', async (req, res) => {
  const { credential } = req.body;

  try {
    // Verify Google credential
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Find or create customer by email
    let user = await Customer.findOne({ where: { email: payload.email } });
    if (!user) {
      user = await Customer.create({
        name: payload.name,
        email: payload.email,
      });
    }

    // Issue JWT for authenticated user
    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({ token });
  } catch (err) {
    console.error("Google token error:", err);
    return res.status(401).json({ message: 'Invalid Google token' });
  }
});

module.exports = router;