import { config } from "dotenv";
import jwt from "jsonwebtoken";

config();

if (process.argv.length < 3) {
  console.error("Error: User ID is required");
  console.log("Usage: node generate-newsletter-token.js <user_id>");
  process.exit(1);
}

const userId = process.argv[2];

// Replace this with your actual JWT secret from your environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret";

const payload = {
  roles: ["newsletter"],
  _id: userId,
  username: "Gestionnaire de newsletter",
};

const token = jwt.sign(payload, JWT_SECRET);
console.log("Generated JWT Token:");
console.log(token);
