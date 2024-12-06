import { config } from "dotenv";
import jwt from "jsonwebtoken";

config();

// Replace this with your actual JWT secret from your environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret";

const payload = {
  roles: ["Newsletter"],
  _id: "newsletter-test-user",
  username: "Newsletter Test User",
};

const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1y" });
console.log("Generated JWT Token:");
console.log(token);
