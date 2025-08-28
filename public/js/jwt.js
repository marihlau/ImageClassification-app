const jwt = require("jsonwebtoken");
const tokenSecret = process.env.JWT_SECRET || "supersecretkey";

// Create a token with username, setting validity period
const generateAccessToken = (user) => {
   return jwt.sign(
      { username: user.username , isAdmin: user.isAdmin }, 
      tokenSecret, 
      { expiresIn: "2h" });
};

// Verify a token and respond with user information
const authenticateToken = (req, res, next) => {
   const authHeader = req.headers["authorization"];
   const token = authHeader && authHeader.split(' ')[1];

   if (!token) {
      console.log("JSON web token missing.");
      return res.sendStatus(401);
   }

   // Check that the token is valid
   try {
      const decodedUser = jwt.verify(token, tokenSecret);
      console.log(
         `authToken verified for user: ${decodedUser.username} at URL ${req.url}`
      );
      // Add user info to the request for the next handler
      req.user = decodedUser;
      next();
   } catch (err) {
      console.log(
         `JWT verification failed at URL ${req.url}`,
         err.name,
         err.message
      );
      return res.sendStatus(401);
   }
};

module.exports = { generateAccessToken, authenticateToken };
