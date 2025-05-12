const { OAuth2Client } = require('google-auth-library');

const CLIENT_ID = "713673211556-44h0d0mig3ftbljehtg40aqod2bm0enn.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

// Middleware to authenticate requests using Google ID token (JWT)
async function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  // Require Bearer token in the Authorization header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    // Attach user info to request object on successful verification
    req.user = ticket.getPayload();
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = authenticateJWT;