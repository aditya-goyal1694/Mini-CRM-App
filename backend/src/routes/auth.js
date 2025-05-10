const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const CLIENT_ID = "713673211556-44h0d0mig3ftbljehtg40aqod2bm0enn.apps.googleusercontent.com";
const { Customer } = require('../models');
const client = new OAuth2Client(CLIENT_ID);

router.post('/google', async (req, res) => {
  const { credential } = req.body;
  try {
    console.log("Received credential:", credential); 
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    

    let user = await Customer.findOne({ where: { email: payload.email } });
    if (!user) {
      user = await Customer.create({
        name: payload.name,
        email: payload.email,
      });
    }

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