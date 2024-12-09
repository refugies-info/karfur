import { config } from "dotenv";
import jwt from "jsonwebtoken";

config();

if (process.argv.length < 3) {
  console.error("Error: User ID is required");
  console.log("Usage: node generate-newsletter-token.js <user_id>");
  process.exit(1);
}

const userId = process.argv[2];

if (!process.env.JWT_SECRET) {
  console.error("Error: The JWT_SECRET env var is required");
  console.log("Usage: node generate-newsletter-token.js <user_id>");
  process.exit(1);
}

const JWT_SECRET = process.env.JWT_SECRET;

const payload = {
  roles: ["newsletter"],
  _id: userId,
  username: "Gestionnaire de newsletter",
};

const token = jwt.sign(payload, JWT_SECRET);
console.log("Generated JWT Token:");
console.log(token);
